/********* download.m Cordova Plugin Implementation *******/

#import "download.h"

@implementation download

- (void)downloadStart:(CDVInvokedUrlCommand*)command {
    
    CDVPluginResult* pluginResult = nil;
    
    NSDictionary *coordinateInfo = [command.arguments objectAtIndex:0];
    
    if ([coordinateInfo isEqual:[NSNull null]] && ![coordinateInfo objectForKey:@"path"]) {
        [self failWithCallbackID:command.callbackId withMessage:@"更新失败，参数格式错误"];
        return ;
    }
    
    NSString *path = [coordinateInfo objectForKey:@"path"];
    NSURL *url= [NSURL URLWithString: path];
    [[UIApplication sharedApplication] openURL:url];
    
    
    if([coordinateInfo objectForKey:@"isClos"]) {
        exit(0);
    }
    
    pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"开始更新"];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void)failWithCallbackID:(NSString *)callbackID withMessage:(NSString *)message
{
    CDVPluginResult *commandResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:message];
    [self.commandDelegate sendPluginResult:commandResult callbackId:callbackID];
}

@end
