/********* Satnav.m Cordova Plugin Implementation *******/

#include "QRPhotoView.h"
#import "YBImageBrowser.h"

@interface QRPhotoView()
@property (nonatomic, copy) NSArray *dataArray;
@end

@implementation QRPhotoView

- (void)show:(CDVInvokedUrlCommand*)command
{
    CDVPluginResult* pluginResult = nil;
    
    NSDictionary *arguments = [command.arguments objectAtIndex:0];
    
    if ([arguments isEqual:[NSNull null]]) {
        [self failWithCallbackID:command.callbackId withMessage:@"参数格式错误"];
        return ;
    }
    
    if ([arguments objectForKey:@"imageArr"]) {
        self.dataArray = [arguments objectForKey:@"imageArr"];
    } else {
        [self failWithCallbackID:command.callbackId withMessage:@"参数格式错误"];
        return ;
    }
    
    NSIndexPath *indexPath;
    if ([arguments objectForKey:@"index"])
    {
        indexPath = [NSIndexPath indexPathForRow:[[arguments objectForKey:@"index"] integerValue] inSection:0];
    }
    else
    {
        indexPath = [NSIndexPath indexPathForRow:0 inSection:0];
    }
    
    [self A_showWithTouchIndexPath:indexPath];
    
    
    pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"显示成功"];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void)A_showWithTouchIndexPath:(NSIndexPath *)indexPath {
    
    //配置数据源（图片浏览器每一张图片对应一个 YBImageBrowserModel 实例）
    NSMutableArray *tempArr = [NSMutableArray array];
    [self.dataArray enumerateObjectsUsingBlock:^(id _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
//        YBImageBrowserModel *model = [YBImageBrowserModel new];
//        [model setImageWithFileName:obj fileType:@"jpeg"];
        //        model.sourceImageView = [self getImageViewOfCellByIndexPath:[NSIndexPath indexPathForRow:idx inSection:0]];
        
        YBImageBrowserModel *model = [YBImageBrowserModel new];
        
        if ([obj isKindOfClass:[NSDictionary class]] && [obj objectForKey:@"url"]) {
            model.url = [NSURL URLWithString:[obj objectForKey:@"url"]];
        } else {
            [model setImageWithBase64String:[obj objectForKey:@"src"]];
        }
        
//        model.sourceImageView = [self getImageViewOfCellByIndexPath:[NSIndexPath indexPathForRow:index inSection:1]];
        [tempArr addObject:model];
    }];
    
    //创建图片浏览器（注意：更多功能请看 YBImageBrowser.h 文件或者 github readme）
    YBImageBrowser *browser = [YBImageBrowser new];
    browser.dataArray = tempArr;
    browser.currentIndex = indexPath.row;
    
    //展示
    [browser show];
}

- (void)failWithCallbackID:(NSString *)callbackID withMessage:(NSString *)message
{
    CDVPluginResult *commandResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:message];
    [self.commandDelegate sendPluginResult:commandResult callbackId:callbackID];
}


@end
