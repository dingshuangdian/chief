package photoview;

import android.content.Intent;
import android.os.Bundle;
import android.support.v4.app.FragmentActivity;
import android.support.v4.view.ViewPager;
import android.view.View;
import android.view.Window;
import android.widget.Button;

import java.util.ArrayList;
import java.util.List;

public class ImageGalleryActivity extends FragmentActivity {
  private List<String> imgUrls; //图片列表
  private Button headBackBtn;
  private ViewPager mViewPager;
  private String flag;

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    requestWindowFeature(Window.FEATURE_NO_TITLE);
//取消状态栏
    /*getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN,
      WindowManager.LayoutParams.FLAG_FULLSCREEN);*/
    setContentView(this.getResources().getIdentifier("activity_touch_gallery",
      "layout", this.getPackageName()));
    imgUrls = DataHolder.getInstance().getData();
    Intent intent = getIntent();
    flag = intent.getStringExtra("flag");
    if (imgUrls == null) {
      imgUrls = new ArrayList<>();
    }
    initView();
    initViewEvent();
    initGalleryViewPager();
  }

  private void initView() {
    headBackBtn = findViewById(this.getResources().getIdentifier("btnBack", "id", this.getPackageName()));

    headBackBtn.setVisibility(View.VISIBLE);
  }

  @Override
  protected void onDestroy() {
    super.onDestroy();
  }

  private void initViewEvent() {
    headBackBtn.setOnClickListener(new View.OnClickListener() {
      @Override
      public void onClick(View v) {
        finish();
      }
    });
  }

  private void initGalleryViewPager() {
    PhotoViewAdapter pagerAdapter = new PhotoViewAdapter(this, imgUrls);
    pagerAdapter.setOnItemChangeListener(new PhotoViewAdapter.OnItemChangeListener() {
      @Override
      public void onItemChange(int currentPosition) {

      }
    });
    mViewPager = findViewById(this.getResources().getIdentifier("viewer", "id", this.getPackageName()));
    mViewPager.setOffscreenPageLimit(3);
    mViewPager.setAdapter(pagerAdapter);
    mViewPager.setCurrentItem(Integer.parseInt(flag));
  }

}
