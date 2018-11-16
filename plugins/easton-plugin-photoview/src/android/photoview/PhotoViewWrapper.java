package photoview;
import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.provider.MediaStore;
import android.util.AttributeSet;
import android.util.Base64;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.RelativeLayout;
import com.squareup.picasso.Callback;
import com.squareup.picasso.Picasso;
public class PhotoViewWrapper extends RelativeLayout {
  protected View loadingDialog;
  protected PhotoView photoView;
  protected Context mContext;
  public PhotoViewWrapper(Context ctx) {
    super(ctx);
    mContext = ctx;
    init();
  }

  public PhotoViewWrapper(Context ctx, AttributeSet attrs) {
    super(ctx, attrs);
    mContext = ctx;
    init();
  }

  public PhotoView getImageView() {
    return photoView;
  }

  protected void init() {
    photoView = new PhotoView(mContext);
    photoView.enable();
    LayoutParams params = new LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT);
    photoView.setLayoutParams(params);
    this.addView(photoView);
    photoView.setVisibility(GONE);

    loadingDialog = LayoutInflater.from(mContext).inflate(mContext.getResources().getIdentifier("photo_view_zoom_progress", "layout", mContext.getPackageName()), null);
    loadingDialog.setLayoutParams(params);
    this.addView(loadingDialog);
  }

  public void setUrl(String imageUrl) {
    Picasso.with(mContext).load(imageUrl)
      .placeholder(mContext.getResources().getIdentifier("default_image", "drawable", mContext.getPackageName()))
      .into(photoView, new Callback() {
        @Override
        public void onSuccess() {
          loadingDialog.setVisibility(View.GONE);
          photoView.setVisibility(VISIBLE);
        }

        @Override
        public void onError() {
          photoView.setBackgroundResource(mContext.getResources().getIdentifier("default_image", "drawable", mContext.getPackageName()));
        }
      });
  }

  public Bitmap stringToBitmap(String string) {
    Bitmap bitmap = null;
    try {
      byte[] bitmapArray = Base64.decode(string, Base64.DEFAULT);
      bitmap = BitmapFactory.decodeByteArray(bitmapArray, 0, bitmapArray.length);
    } catch (Exception e) {
      e.printStackTrace();
    }
    return bitmap;
  }
  public void setBitmap(String url) {
    Uri uri = Uri.parse(MediaStore.Images.Media.insertImage(mContext.getContentResolver(), stringToBitmap(url), null, null));
    Picasso.with(mContext).load(uri)
      .placeholder(mContext.getResources().getIdentifier("default_image", "drawable", mContext.getPackageName()))
      .into(photoView, new Callback() {
        @Override
        public void onSuccess() {
          loadingDialog.setVisibility(View.GONE);
          photoView.setVisibility(VISIBLE);
        }
        @Override
        public void onError() {
          photoView.setBackgroundResource(mContext.getResources().getIdentifier("default_image", "drawable", mContext.getPackageName()));
        }
      });

  }

}
