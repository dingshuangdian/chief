//
//  CameraViewController.m
//  BankCardRecog
//
//  Created by wintone on 15/1/22.
//  Copyright (c) 2015年 wintone. All rights reserved.
//

#import "WTPlateIDCameraViewController.h"
#import "WTOverView.h"
//#import "WintonePlateIDPro.h"
//#import "PlateResult.h"
//#import "PlateFormat.h"
#import "PlateIDOCR.h"
#import "PlateResult.h"
#import "PlateFormat.h"

#import <CoreMotion/CoreMotion.h>

//屏幕的宽、高
#define kScreenWidth  [UIScreen mainScreen].bounds.size.width
#define kScreenHeight [UIScreen mainScreen].bounds.size.height


@interface WTPlateIDCameraViewController ()<UIAlertViewDelegate,AVCaptureVideoDataOutputSampleBufferDelegate>{
    AVCaptureSession *_session;
    AVCaptureDeviceInput *_captureInput;
    AVCaptureStillImageOutput *_captureOutput;
    AVCaptureVideoPreviewLayer *_preview;
    AVCaptureDevice *_device;
    AVCaptureConnection *_videoConnection;
    
    WTOverView *_overView;
    BOOL _on;
//    WintonePlateIDPro *_plateIDRecog;
    PlateIDOCR *_plateIDRecog;
    UIButton *_flashBtn;
    UILabel *_tipsLabel;
    
    //识别结果
    NSArray *_results;
    //识别帧图像
    UIImage *_image;
}
@property (assign, nonatomic) BOOL adjustingFocus;
@property (nonatomic, retain) CALayer *customLayer;
@end

@implementation WTPlateIDCameraViewController
int initCode;
- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
    self.view.backgroundColor = [UIColor clearColor];
    
    //设置检边视图层
    _overView = [[WTOverView alloc] initWithFrame:self.view.bounds];
    
    //初始化识别核心
    [self initRecog];
    _results = [NSArray array];
    //初始化相机
    [self initialize];
}

- (void) viewWillAppear:(BOOL)animated
{
    [super viewWillAppear:animated];
    if (kScreenWidth < 330) {
        self.adjustingFocus = YES;
    }
    self.navigationController.navigationBarHidden = NO;
    AVCaptureDevice*camDevice =[AVCaptureDevice defaultDeviceWithMediaType:AVMediaTypeVideo];
    int flags =NSKeyValueObservingOptionNew;
    //注册通知,观察是否聚焦成功
    [camDevice addObserver:self forKeyPath:@"adjustingFocus" options:flags context:nil];
    
    [_session startRunning];

}


- (void) viewDidDisappear:(BOOL)animated{
    [super viewDidDisappear:animated];
    AVCaptureDevice*camDevice =[AVCaptureDevice defaultDeviceWithMediaType:AVMediaTypeVideo];
    [camDevice removeObserver:self forKeyPath:@"adjustingFocus"];
    
    [_device lockForConfiguration:nil];
    if (_on) {
        [_device setTorchMode: AVCaptureTorchModeOff];
    }
    [_device unlockForConfiguration];
    
    [_session stopRunning];
}

//初始化识别核心
- (void) initRecog
{
//    _plateIDRecog = [[WintonePlateIDPro alloc] init];
    _plateIDRecog = [[PlateIDOCR alloc] init];
//    /*在此填写开发码，初始化识别核心*/
    int init = [_plateIDRecog initPalteIDWithDevcode:self.Devcode_Key RecogType:2];
    initCode = init;
    NSLog(@"init===%d",init);
    
    //车牌识别设置
    [_plateIDRecog setPlateFormat:[self getPlateFormat]];
}

//车牌识别设置
- (PlateFormat *)getPlateFormat {
    PlateFormat *plateFormat = [[PlateFormat alloc] init];
    /*
     *************用到哪个设置哪个，设置越多，识别越慢,阈值必须设置
     armpolice;// 单层武警车牌是否开启:1是；0不是
     armpolice2;// 双层武警车牌是否开启:1是；0不是
     embassy;// 使馆车牌是否开启:1是；0不是
     individual;// 是否开启个性化车牌:1是；0不是
     nOCR_Th;// 识别阈值(取值范围0-9,2:默认阈值   0:最宽松的阈值   9:最严格的阈值)  ***必须设置
     int nPlateLocate_Th;//定位阈值(取值范围0-9,5:默认阈值   0:最宽松的阈值  9:最严格的阈值) ***必须设置
     int tworowyellow;//双层黄色车牌是否开启:1是；0不是
     int tworowarmy;// 双层军队车牌是否开启:1是；0不是
     NSString *szProvince;// 省份顺序
     int mtractor;// 农用车车牌是否开启:1是；0不是
     civilAviation;// 民航车牌是否开启：1是；0不是
     consulate;// 领事馆车牌是否开启：1是；0不是
     newEnergy;// 新能源车牌是否开启：1是；0不是
     */
    
    plateFormat.nOCR_Th = 9;
    plateFormat.nPlateLocate_Th = 9;
    plateFormat.armpolice = 1;
    plateFormat.armpolice2 = 1;
    plateFormat.tworowyellow = 1;
    plateFormat.newEnergy = 1;
    plateFormat.embassy = 0;
    plateFormat.individual = 0;
    plateFormat.tworowarmy = 0;
    plateFormat.mtractor = 0;
    plateFormat.tworowyellow_only = 0;
    plateFormat.civilAviation = 0;
    plateFormat.consulate = 0;
    
    return plateFormat;
}

//监听对焦
-(void)observeValueForKeyPath:(NSString*)keyPath ofObject:(id)object change:(NSDictionary*)change context:(void*)context {
    if([keyPath isEqualToString:@"adjustingFocus"]){
        self.adjustingFocus =[[change objectForKey:NSKeyValueChangeNewKey] isEqualToNumber:[NSNumber numberWithInt:1]];
    }
}

//初始化
- (void) initialize
{
    //判断摄像头授权
    NSString *mediaType = AVMediaTypeVideo;
    AVAuthorizationStatus authStatus = [AVCaptureDevice authorizationStatusForMediaType:mediaType];
    if(authStatus == AVAuthorizationStatusRestricted || authStatus == AVAuthorizationStatusDenied){
        
        UIAlertView * alert = [[UIAlertView alloc] initWithTitle:@"未获得授权使用摄像头" message:@"请在iOS '设置中-隐私-相机' 中打开" delegate:self cancelButtonTitle:nil otherButtonTitles:@"知道了", nil];
        [alert show];
        return;
    }
    
    //1.创建会话层
    _session = [[AVCaptureSession alloc] init];
    [_session setSessionPreset:AVCaptureSessionPreset1280x720];    
    
    //2.创建、配置输入设备
    NSArray *devices = [AVCaptureDevice devicesWithMediaType:AVMediaTypeVideo];
    
    for (AVCaptureDevice *device in devices)
    {
        if (device.position == AVCaptureDevicePositionBack){
            _device = device;
            _captureInput = [AVCaptureDeviceInput deviceInputWithDevice:device error:nil];
        }
    }
    [_session addInput:_captureInput];
    
    ///out put
    AVCaptureVideoDataOutput *captureOutput = [[AVCaptureVideoDataOutput alloc] init];
    captureOutput.alwaysDiscardsLateVideoFrames = YES;
    
    dispatch_queue_t queue;
    queue = dispatch_queue_create("cameraQueue", NULL);
    [captureOutput setSampleBufferDelegate:self queue:queue];
    
    //    dispatch_release(queue);
    NSString* key = (NSString*)kCVPixelBufferPixelFormatTypeKey;
    NSNumber* value = [NSNumber
                       numberWithUnsignedInt:kCVPixelFormatType_32BGRA];
    NSDictionary* videoSettings = [NSDictionary
                                   dictionaryWithObject:value forKey:key];
    [captureOutput setVideoSettings:videoSettings];
    [_session addOutput:captureOutput];
    
    //3.创建、配置输出
    _captureOutput = [[AVCaptureStillImageOutput alloc] init];
    NSDictionary *outputSettings = [[NSDictionary alloc] initWithObjectsAndKeys:AVVideoCodecJPEG,AVVideoCodecKey,nil];
    [_captureOutput setOutputSettings:outputSettings];
    
    for (AVCaptureConnection *connection in captureOutput.connections) {
        for (AVCaptureInputPort *port in [connection inputPorts]) {
            if ([[port mediaType] isEqual:AVMediaTypeVideo] ) {
                _videoConnection = connection;
                break;
            }
        }
        if (_videoConnection) { break; }
    }
    /*设置视频流方向，默认设置为竖屏*/
    _videoConnection.videoOrientation = AVCaptureVideoOrientationPortrait;
    [_session addOutput:_captureOutput];
    
    //设置相机预览层
    _preview = [AVCaptureVideoPreviewLayer layerWithSession: _session];
    _preview.frame = CGRectMake(0, 0, self.view.frame.size.width, self.view.frame.size.height);
    _preview.videoGravity = AVLayerVideoGravityResizeAspectFill;
    [self.view.layer addSublayer:_preview];
    [_session startRunning];
    
    //设置覆盖层
    CAShapeLayer *maskWithHole = [CAShapeLayer layer];
    CGRect biggerRect = self.view.bounds;
    CGFloat offset = 1.0f;
    if ([[UIScreen mainScreen] scale] >= 2) {
        offset = 0.5;
    }
    
    
    CGRect smallFrame = _overView.smallrect;
    CGRect smallerRect = CGRectInset(smallFrame, -offset, -offset) ;
    
    UIBezierPath *maskPath = [UIBezierPath bezierPath];
    [maskPath moveToPoint:CGPointMake(CGRectGetMinX(biggerRect), CGRectGetMinY(biggerRect))];
    [maskPath addLineToPoint:CGPointMake(CGRectGetMinX(biggerRect), CGRectGetMaxY(biggerRect))];
    [maskPath addLineToPoint:CGPointMake(CGRectGetMaxX(biggerRect), CGRectGetMaxY(biggerRect))];
    [maskPath addLineToPoint:CGPointMake(CGRectGetMaxX(biggerRect), CGRectGetMinY(biggerRect))];
    [maskPath addLineToPoint:CGPointMake(CGRectGetMinX(biggerRect), CGRectGetMinY(biggerRect))];
    [maskPath moveToPoint:CGPointMake(CGRectGetMinX(smallerRect), CGRectGetMinY(smallerRect))];
    [maskPath addLineToPoint:CGPointMake(CGRectGetMinX(smallerRect), CGRectGetMaxY(smallerRect))];
    [maskPath addLineToPoint:CGPointMake(CGRectGetMaxX(smallerRect), CGRectGetMaxY(smallerRect))];
    [maskPath addLineToPoint:CGPointMake(CGRectGetMaxX(smallerRect), CGRectGetMinY(smallerRect))];
    [maskPath addLineToPoint:CGPointMake(CGRectGetMinX(smallerRect), CGRectGetMinY(smallerRect))];
    [maskWithHole setPath:[maskPath CGPath]];
    [maskWithHole setFillRule:kCAFillRuleEvenOdd];
    [maskWithHole setFillColor:[[UIColor colorWithWhite:0 alpha:0.35] CGColor]];
    [self.view.layer addSublayer:maskWithHole];
    [self.view.layer setMasksToBounds:YES];
    
    _overView.backgroundColor = [UIColor clearColor];
    [self.view addSubview:_overView];
    
    //闪光灯按钮
    _flashBtn = [UIButton buttonWithType:UIButtonTypeCustom];
    [_flashBtn setImage:[UIImage imageNamed:@"camera_flash_off.png"] forState:UIControlStateNormal];
    [_flashBtn setImage:[UIImage imageNamed:@"camera_flash_on.png"] forState:UIControlStateSelected];
    _flashBtn.frame = CGRectMake(kScreenWidth-50, 20, 40, 40);
    [_flashBtn addTarget:self action:@selector(openFlash:) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:_flashBtn];
    _on = NO;
    
    
    //返回按钮
    UIButton *backBtn = [UIButton buttonWithType:UIButtonTypeCustom];
    [backBtn setImage:[UIImage imageNamed:@"camera_back.png"] forState:UIControlStateNormal];
    backBtn.frame = CGRectMake(16, 26.25, 27.5, 27.5);
    [backBtn addTarget:self action:@selector(backView) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:backBtn];
    
    _tipsLabel = [[UILabel alloc] init];
    _tipsLabel.frame = CGRectMake(0, 0, 300, 30);
    CGPoint center = self.view.center;
//    _tipsLabel.center = CGPointMake(center.x, center.y+150);
    _tipsLabel.center = center;
    if (initCode==0){
        _tipsLabel.text = @"请将车牌对准此取景框";
    }else {
        _tipsLabel.text = [NSString stringWithFormat:@"请将车牌对准此取景框:%d" ,initCode];
    }
    _tipsLabel.textColor = [UIColor whiteColor];
    _tipsLabel.textAlignment = NSTextAlignmentCenter;
    _tipsLabel.font = [UIFont systemFontOfSize:13.0f];
    [self.view addSubview:_tipsLabel];
}

//从摄像头缓冲区获取图像
#pragma mark -
#pragma mark AVCaptureSession delegate
- (void)captureOutput:(AVCaptureOutput *)captureOutput
didOutputSampleBuffer:(CMSampleBufferRef)sampleBuffer
       fromConnection:(AVCaptureConnection *)connection
{
    
    CVImageBufferRef imageBuffer = CMSampleBufferGetImageBuffer(sampleBuffer);
    CVPixelBufferLockBaseAddress(imageBuffer,0);
    uint8_t *baseAddress = (uint8_t *)CVPixelBufferGetBaseAddress(imageBuffer);
    size_t width = CVPixelBufferGetWidth(imageBuffer);
    size_t height = CVPixelBufferGetHeight(imageBuffer);
    size_t bytesPerRow = CVPixelBufferGetBytesPerRow(imageBuffer);
    
    //识别车牌图像
    
    _results = [_plateIDRecog recogImageWithBuffer:baseAddress recogCount:1 nWidth:(int)width nHeight:(int)height recogRange:_overView.smallrect confidence:75];
//    _results = [_plateIDRecog recogImageWithBuffer:baseAddress recogCount:1 nWidth:(int)width nHeight:(int)height recogRange:_overView.smallrect PlateFormat:plateFormat];
        if (_results.count > 0) {
            //根据当前帧数据生成UIImage图像，保存图像使用
            CGColorSpaceRef colorSpace = CGColorSpaceCreateDeviceRGB();
            
            CGContextRef context = CGBitmapContextCreate(baseAddress, width, height, 8,bytesPerRow, colorSpace, kCGBitmapByteOrder32Little |kCGImageAlphaPremultipliedFirst);
            
            CGImageRef quartzImage = CGBitmapContextCreateImage(context);
            CGContextRelease(context);
            CGColorSpaceRelease(colorSpace);
            /*
             该图片用于快速模式，即初始化设置为0时使用。
             */
            _image = [UIImage imageWithCGImage:quartzImage scale:1.0f orientation:UIImageOrientationRight];
            CGImageRelease(quartzImage);
            //识别完成，展示结果
            [self performSelectorOnMainThread:@selector(showResults) withObject:nil waitUntilDone:NO];
            // 停止取景
            [_session stopRunning];
        }
    
    CVPixelBufferUnlockBaseAddress(imageBuffer,0);

}



// 扫描识别获取最终结果
- (void) showResults
{
    
    PlateResult *plateResult = _results.firstObject;
    if (self.resultBlock) {
        self.resultBlock(plateResult.license);
        [self dismissViewControllerAnimated:YES completion:nil];
    }
}

#pragma mark - UIAlertViewDelegate
- (void)alertView:(UIAlertView *)alertView clickedButtonAtIndex:(NSInteger)buttonIndex{
//    [_session startRunning];
    [self dismissViewControllerAnimated:YES completion:nil];
}

//闪光灯按钮点击事件
- (void)openFlash:(UIButton *)btn{
    
    btn.selected = !btn.selected;
    if (![_device hasTorch]) {
        //NSLog(@"no torch");
    }else{
        [_device lockForConfiguration:nil];
        if (!_on) {
            [_device setTorchMode: AVCaptureTorchModeOn];
            _on = YES;
        }else{
            [_device setTorchMode: AVCaptureTorchModeOff];
            _on = NO;
        }
        [_device unlockForConfiguration];
    }
}

- (void)backView {
    [self dismissViewControllerAnimated:YES completion:nil];
}


//释放核心
- (void)dealloc {
    [_plateIDRecog uninitPlateIDSDK];
}


/*
 #pragma mark - Navigation
 
 // In a storyboard-based application, you will often want to do a little preparation before navigation
 - (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
 // Get the new view controller using [segue destinationViewController].
 // Pass the selected object to the new view controller.
 }
 */


@end
