//
//  BSTool.h
//  template
//
//  Created by I-smartnet on 2017/3/24.
//
//


#import <Cordova/CDV.h>

@interface BSTool : CDVPlugin

- (void)getNVInfo:(CDVInvokedUrlCommand*)command;


- (void)backNavi:(CDVInvokedUrlCommand*)command;

- (void)pushBSView:(CDVInvokedUrlCommand*)command;
@end
