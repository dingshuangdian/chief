//
//  CameraViewController.h
//  BankCardRecog
//
//  Created by wintone on 15/1/22.
//  Copyright (c) 2015年 wintone. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <AVFoundation/AVFoundation.h>
#import <AudioToolbox/AudioToolbox.h>
#import <CoreMedia/CoreMedia.h>

typedef void(^ResultBlock)(NSString *resultDic);
@interface WTPlateIDCameraViewController : UIViewController
@property (nonatomic, copy) NSString *Devcode_Key;
@property (nonatomic, copy) ResultBlock resultBlock;
@end
