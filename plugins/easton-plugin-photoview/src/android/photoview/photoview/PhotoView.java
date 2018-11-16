package photoview.photoview;

import android.app.Activity;
import android.content.Intent;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaWebView;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import java.util.ArrayList;
import java.util.List;
import photoview.DataHolder;
import photoview.ImageGalleryActivity;
/**
 * This class echoes a string called from JavaScript.
 */
public class PhotoView extends CordovaPlugin {
  private List<String> list = new ArrayList<>();
  private Activity cordovaActivity;

  @Override
  public void initialize(CordovaInterface cordova, CordovaWebView webView) {
    super.initialize(cordova, webView);
    cordovaActivity = cordova.getActivity();
  }

  @Override
  public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
    if (action.equals("show")) {
      list.clear();
      JSONObject jsonObject = args.getJSONObject(0);
      String url = jsonObject.optString("imageArr");
      String flag=jsonObject.optString("index");
      JSONArray jsonArray = new JSONArray(url);
      for (int i = 0; i < jsonArray.length(); i++) {
        JSONObject object = (JSONObject) jsonArray.get(i);
        if (object.has("src")) {
          String base64 = object.getString("src");
          list.add(base64);
        } else if (object.has("url")) {
          String tarUrl = object.getString("url").replace("\\", "/");
          list.add(tarUrl);
        }
      }
      DataHolder.getInstance().setData(list);
      Intent intent = new Intent(cordovaActivity, ImageGalleryActivity.class);
      intent.putExtra("flag",flag);
      cordovaActivity.startActivity(intent);
    }
    return true;
  }
}
