//
//  OverView.h
//  TestCamera
//
//  Created by wintone on 14/11/25.
//  Copyright (c) 2014年 zzzili. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface WTOverView : UIView

@property (assign, nonatomic) BOOL leftHidden;
@property (assign, nonatomic) BOOL rightHidden;
@property (assign, nonatomic) BOOL topHidden;
@property (assign, nonatomic) BOOL bottomHidden;

@property (assign ,nonatomic) NSInteger smallX;
@property (assign ,nonatomic) CGRect smallrect;
@property (assign ,nonatomic) CGRect maxrect;
@property (assign, nonatomic) int nrotate;

//设置识别区域
- (CGRect)setRecogAreaWithNrotate:(int)nrotate;

//获取外边的框
- (CGRect)getMaxrect;

@end
