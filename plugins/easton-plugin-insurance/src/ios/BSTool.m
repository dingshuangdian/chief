/********* BSTool.m Cordova Plugin Implementation *******/

#import "BSTool.h"
#import <objc/message.h>

@interface BSTool()
@property (nonatomic, copy) NSString* callbackId;
@end

@implementation BSTool

- (void)getNVInfo:(CDVInvokedUrlCommand*)command
{
    NSString* echo = [command.arguments objectAtIndex:0];

    if (echo != nil && [echo length] > 0) {
        self.callbackId = command.callbackId;
        
        if ([echo isEqualToString:@"zmInfo"]) {
            [self getZmInfo];
        }
        
        return;
    } else {
        [self returnNaviInfo:@"参数格式错误！"];
    }
}


- (void)getZmInfo {
    
    NSUserDefaults* userDefaults = [NSUserDefaults standardUserDefaults];
    NSMutableDictionary *zmInfo = [userDefaults objectForKey:@"zmInfo"];

    [self returnNaviInfo:zmInfo];
}


- (void)returnNaviInfo:(id)info {
    
    CDVPluginResult* pluginResult = nil;
    
    if ([info isKindOfClass:[NSMutableDictionary class]]) {
       pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:info];
    }
    
    if ([info isKindOfClass:[NSString class]]) {
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:info];
    }
    
    [self.commandDelegate sendPluginResult:pluginResult callbackId:self.callbackId];
}


- (void)backNavi:(CDVInvokedUrlCommand*)command
{
    UIViewController *currentVC = [self getCurrentVCWithRootView:nil];
//    [currentVC.navigationController popViewControllerAnimated:YES];
    
    [currentVC dismissViewControllerAnimated:YES completion:nil];
}


- (UIViewController *)getCurrentVCWithRootView:(id)rootview
{
    UIViewController *result = nil;
    
    UIViewController *parmenr = nil;
    
    if (!rootview) {
        UIWindow * window = [[UIApplication sharedApplication] keyWindow];
        if (window.windowLevel != UIWindowLevelNormal)
        {
            NSArray *windows = [[UIApplication sharedApplication] windows];
            for(UIWindow * tmpWin in windows)
            {
                if (tmpWin.windowLevel == UIWindowLevelNormal)
                {
                    window = tmpWin;
                    break;
                }
            }
        }
        
        UIView *frontView = [[window subviews] objectAtIndex:0];
        id nextResponder = [frontView nextResponder];
        
        if ([nextResponder isKindOfClass:[UIViewController class]])
        parmenr = nextResponder;
        else
        parmenr = window.rootViewController;
        
    } else {
        parmenr = rootview;
    }
    
    
    if ([parmenr isKindOfClass:[UITabBarController class]]) {
        UITabBarController *tabbarController = (UITabBarController *)parmenr;
        
        
        if ([tabbarController.selectedViewController isKindOfClass:[UINavigationController class]]) {
            
            UINavigationController *NVGC = tabbarController.selectedViewController;
            
            result = [NVGC.viewControllers lastObject];
            
        }else if ([tabbarController.selectedViewController isKindOfClass:[UIViewController class]]) {
            
            result = tabbarController.selectedViewController;
        }
    } else if ([parmenr isKindOfClass:[UINavigationController class]]){
        UINavigationController *NVGC = (UINavigationController *)parmenr;
        
        result = [NVGC.viewControllers lastObject];
    } else if ([parmenr isKindOfClass:[UIViewController class]]) {
        result = parmenr;
    }
    
    
    UIViewController *appRootVC = [UIApplication sharedApplication].keyWindow.rootViewController;
    UIViewController *topVC = appRootVC;
    if (topVC.presentedViewController) {
        result = topVC.presentedViewController;
    }
    
    return result;
}

- (void)pushBSView:(CDVInvokedUrlCommand *)command {
    
    NSDictionary* echo = [command.arguments objectAtIndex:0];
    if (echo != nil && [echo isKindOfClass: [NSDictionary class]]) {
        NSUserDefaults* userDefaults = [NSUserDefaults standardUserDefaults];
        NSMutableDictionary *zmInfo = [NSMutableDictionary dictionary];
        for (id key in echo)
        {
            
            [zmInfo setObject:echo[key] forKey:key];
        }
        [userDefaults setObject:zmInfo forKey:@"zmInfo"];
    } else {
        [self returnNaviInfo:@"参数格式错误！"];
        return;
    }
    
    CDVViewController *bcVC = [[CDVViewController alloc] init];
    bcVC.configFile = @"IBSconfig.xml";
    bcVC.wwwFolderName = @"IBSwww";
    [self.viewController presentViewController:bcVC animated:YES completion:nil];
}


@end
