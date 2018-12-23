//
//  OverView.m
//  TestCamera
//


#import "WTOverView.h"
#import <CoreText/CoreText.h>

/*屏幕宽高*/
#define KSCREENWIDTH  [UIScreen mainScreen].bounds.size.width
#define KSCREENHEIGHT [UIScreen mainScreen].bounds.size.height


@interface WTOverView ()
@property (nonatomic, assign) CGFloat maxLT;
@property (nonatomic, assign) CGFloat maxRT;
@property (nonatomic, assign) CGFloat maxRB;
@end


@implementation WTOverView

- (id) initWithFrame:(CGRect)frame
{
    self = [super initWithFrame:frame];
    if (self) {
        CGFloat smallwid = KSCREENWIDTH * 0.85;
        CGFloat smallhei = KSCREENWIDTH *0.65;
        self.smallrect = CGRectMake((KSCREENWIDTH - smallwid)/2, (KSCREENHEIGHT - smallhei)/2, smallwid, smallhei);
        _nrotate = 1;
    }
    return self;
}

- (CGRect)setRecogAreaWithNrotate:(int)nrotate {
    
    if (nrotate == 1 || nrotate == 3) {
        CGFloat smallwid = KSCREENWIDTH * 0.85;
        CGFloat smallhei = KSCREENWIDTH *0.65;
        self.smallrect = CGRectMake((KSCREENWIDTH - smallwid)/2, (KSCREENHEIGHT - smallhei)/2, smallwid, smallhei);
    } else {
        CGFloat smallwid = KSCREENWIDTH * 0.6;
        CGFloat smallhei = KSCREENHEIGHT *0.55;
        self.smallrect = CGRectMake((KSCREENWIDTH - smallwid)/2, (KSCREENHEIGHT - smallhei)/2, smallwid, smallhei);
    }
    [self setNeedsDisplay];
    return self.smallrect;
}

- (CGRect)getMaxrect {
    if (_nrotate == 1 || _nrotate == 3) {
        CGFloat maxwid = KSCREENWIDTH * 0.9;
        CGFloat maxhei = KSCREENWIDTH *0.7;
        self.maxrect = CGRectMake((KSCREENWIDTH - maxwid)/2, (KSCREENHEIGHT - maxhei)/2, maxwid, maxhei);
    } else {
        CGFloat maxwid = KSCREENWIDTH * 0.65;
        CGFloat maxhei = KSCREENHEIGHT *0.58;
        self.maxrect = CGRectMake((KSCREENWIDTH - maxwid)/2, (KSCREENHEIGHT - maxhei)/2, maxwid, maxhei);
    }
    return self.maxrect;
}


- (void) drawRect:(CGRect)rect
{
    [super drawRect:rect];
    {
        CGRect maxrect;
        CGRect smallrect;
        if (_nrotate == 1 || _nrotate == 3) {
            CGFloat maxwid = KSCREENWIDTH * 0.9;
            CGFloat maxhei = KSCREENWIDTH *0.7;
            
            CGFloat smallwid = KSCREENWIDTH * 0.85;
            CGFloat smallhei = KSCREENWIDTH *0.65;
            
            maxrect = CGRectMake((KSCREENWIDTH - maxwid)/2, (KSCREENHEIGHT - maxhei)/2, maxwid, maxhei);
            smallrect = CGRectMake((KSCREENWIDTH - smallwid)/2, (KSCREENHEIGHT - smallhei)/2, smallwid, smallhei);
        } else {
            CGFloat maxwid = KSCREENWIDTH * 0.65;
            CGFloat maxhei = KSCREENHEIGHT *0.58;
            
            CGFloat smallwid = KSCREENWIDTH * 0.6;
            CGFloat smallhei = KSCREENHEIGHT *0.55;
            
            maxrect = CGRectMake((KSCREENWIDTH - maxwid)/2, (KSCREENHEIGHT - maxhei)/2, maxwid, maxhei);
            smallrect = CGRectMake((KSCREENWIDTH - smallwid)/2, (KSCREENHEIGHT - smallhei)/2, smallwid, smallhei);
        }
        
        UIBezierPath *maxrectangle = [UIBezierPath bezierPathWithRect:maxrect];
        //边框线宽
        maxrectangle.lineWidth = 3;
        //边框线颜色
        [[UIColor colorWithRed:80/250.0 green:205/250.0 blue:204/250.0 alpha:1.0] setStroke];
        /*
         *线条之间连接点形状
         *kCGLineJoinMiter,      //内斜接
         *kCGLineJoinRound,     //圆角
         *kCGLineJoinBevel      //外斜接
         */
        maxrectangle.lineJoinStyle = kCGLineJoinRound;
        //绘制边框
        [maxrectangle stroke];
        UIBezierPath *smallrectangle = [UIBezierPath bezierPathWithRect:smallrect];
        //边框线宽
        smallrectangle.lineWidth = 3;
        //边框线颜色
        [[UIColor colorWithRed:80/250.0 green:205/250.0 blue:204/250.0 alpha:1.0] setStroke];
        /*
         *线条之间连接点形状
         *kCGLineJoinMiter,      //内斜接
         *kCGLineJoinRound,     //圆角
         *kCGLineJoinBevel      //外斜接
         */
        smallrectangle.lineJoinStyle = kCGLineJoinRound;
        //绘制边框
        [smallrectangle stroke];
        UIBezierPath *fillPath = [UIBezierPath bezierPathWithRect:maxrect];
        [fillPath appendPath:[UIBezierPath bezierPathWithRect:smallrect]];
        [fillPath setUsesEvenOddFillRule:YES];
        [[UIColor colorWithRed:179/250.0 green:181/250.0 blue:183/250.0 alpha:0.5] setFill];
        [fillPath fill];
    }
    
}

/*
 // Only override drawRect: if you perform custom drawing.
 // An empty implementation adversely affects performance during animation.
 - (void)drawRect:(CGRect)rect {
 // Drawing code
 }
 */

@end
