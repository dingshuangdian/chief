//
//  PlateIDSlider.m
//  PlateIDDemo
//
//

#import "PlateIDSlider.h"

#define kScreenWidth  [UIScreen mainScreen].bounds.size.width
#define kScreenHeight [UIScreen mainScreen].bounds.size.height


@implementation PlateIDSlider

- (CGRect)trackRectForBounds:(CGRect)bounds {
    CGFloat maxwid;
    if (_nrotate == 1 || _nrotate == 3) {
       maxwid = kScreenWidth * 0.9;
    } else {
        maxwid = kScreenHeight * 0.58;
    }
    return CGRectMake(0, 0, maxwid, 8);
    
}

/*
// Only override drawRect: if you perform custom drawing.
// An empty implementation adversely affects performance during animation.
- (void)drawRect:(CGRect)rect {
    // Drawing code
}
*/

@end
