/********* CardScan.m Cordova Plugin Implementation *******/

#import "OcrplateidSmart.h"
#import "WTPlateIDCameraViewController.h"

@implementation OcrplateidSmart

- (void)ocrplateidSmartOpen:(CDVInvokedUrlCommand*)command {
    NSDictionary *plistDic = [[NSBundle mainBundle] infoDictionary];
    NSString* DEVCODE_KEY = [[plistDic objectForKey:@"OcrplateidSmart"] objectForKey:@"DEVCODE_KEY"];
    
    WTPlateIDCameraViewController *bcVC = [[WTPlateIDCameraViewController alloc] init];
    bcVC.Devcode_Key = DEVCODE_KEY;
    [self.viewController presentViewController:bcVC animated:YES completion:nil];
    
    
    
    bcVC.resultBlock = ^(NSString *resultDic){
        
        CDVPluginResult *result = nil;
        
        if (resultDic) {
        
            result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:resultDic];
            
        } else {
            result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR];
        }
        
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
        
    };
}

@end
