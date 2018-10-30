package chiefchain;

import android.app.Activity;
import android.content.Intent;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaWebView;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
/**
 * This class echoes a string called from JavaScript.
 */
public class BSTool extends CordovaPlugin {
  Activity mActivity;
  CallbackContext mCallbackContext;
  @Override
  public void initialize(CordovaInterface cordova, CordovaWebView webView) {
    super.initialize(cordova, webView);
    mActivity = cordova.getActivity();
  }

  @Override
  public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
    this.mCallbackContext = callbackContext;
    if (action.equals("getNVInfo")) {
      String message = args.getString(0);
      if (message.equals("zmInfo")) {
        JSONObject jsonMsg = new JSONObject();
        //jsonMsg.put("username", SharedPreferences.getInstance(mActivity).getStringValue("lgiName"));
        //jsonMsg.put("password", SharedPreferences.getInstance(mActivity).getStringValue("lgPwd"));
        jsonMsg.put("home", SharedPreferences.getInstance(mActivity).getStringValue("home"));
        jsonMsg.put("carNum", SharedPreferences.getInstance(mActivity).getStringValue("carNum"));
        jsonMsg.put("tokenId", "");
        if (jsonMsg != null) {
          mCallbackContext.success(jsonMsg);
        } else {
          mCallbackContext.error("null");
        }
      }
      return true;
    } else if (action.equals("backNavi")) {
      this.backNavi(callbackContext);
      return true;
    } else if (action.equals("pushBSView")) {
      JSONObject jsonObject = args.getJSONObject(0);
      //String lgName = jsonObject.optString("lgiName");
      //String lgPwd = jsonObject.optString("lgiPwd");
      String firstType = jsonObject.optString("home");
      String carNum=jsonObject.optString("carNum");
      //String tokenId = jsonObject.optString("tokenId");
      //SharedPreferences.getInstance(mActivity).putStringValue("lgiName", lgName);
      //SharedPreferences.getInstance(mActivity).putStringValue("lgPwd", lgPwd);
      //SharedPreferences.getInstance(mActivity).putStringValue("tokenId", tokenId);
      SharedPreferences.getInstance(mActivity).putStringValue("home", firstType);
      SharedPreferences.getInstance(mActivity).putStringValue("carNum", carNum);
      Intent intent = new Intent(mActivity, CXActivity.class);
      mActivity.startActivity(intent);
      return true;
    }
    return false;
  }
  private void getToken(String message, CallbackContext callbackContext) {
    if (message != null && message.length() > 0) {
      callbackContext.success("获取信息成功" + message);
    } else {
      callbackContext.error("错误");
    }
  }
  private void backNavi(CallbackContext callbackContext) {
    callbackContext.success("返回");
  }

}
