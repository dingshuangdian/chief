package ocrplateid;

import android.Manifest;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Build;
import android.widget.Toast;

import com.kernal.plateid.MemoryCameraActivity;

import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaWebView;
import org.json.JSONArray;
import org.json.JSONException;

import java.util.ArrayList;

import static android.app.Activity.RESULT_OK;


/**
 * This class echoes a string called from JavaScript.
 */
public class OcrplateidSmart extends CordovaPlugin {
  private static Activity cordovaActivity;
  private static Context mContext;
  private static final int requestCodeOcr = 1002;
  public CallbackContext callbackContext;
  public CordovaInterface cordovaInterface;
  /**
   * 安卓6以上动态权限相关
   */

  private static final int REQUEST_CODE = 100001;

  private boolean needsToAlertForRuntimePermission() {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
      return !cordova.hasPermission(Manifest.permission.WRITE_EXTERNAL_STORAGE) || !cordova.hasPermission(Manifest.permission.CAMERA) || !cordova.hasPermission(Manifest.permission.READ_PHONE_STATE);
    } else {
      return false;
    }
  }

  @Override
  public void initialize(CordovaInterface cordova, CordovaWebView webView) {
    super.initialize(cordova, webView);
    cordovaActivity = cordova.getActivity();
    cordovaInterface = cordova;
    mContext = cordova.getActivity().getApplication();
  }

  @Override
  public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
    this.callbackContext = callbackContext;
    if (action.equals("ocrplateidSmartOpen")) {
      ininCar();
    }
    return true;
  }

  private void ininCar() {
    if (!needsToAlertForRuntimePermission()) {
      Intent cameraintent = new Intent(cordovaActivity, MemoryCameraActivity.class);
      cameraintent.putExtra("camera", true);
      cordovaInterface.startActivityForResult(this, cameraintent, requestCodeOcr);
    } else {
      requestPermission();
    }
  }

  @Override
  public void onActivityResult(int requestCode, int resultCode, Intent data) {
    if (requestCode == requestCodeOcr && resultCode == RESULT_OK) {
      String carNo = data.getStringExtra("carNo");
      callbackContext.success(carNo);
    }
    super.onActivityResult(requestCode, resultCode, data);

  }

  private void requestPermission() {
    ArrayList<String> permissionsToRequire = new ArrayList<String>();
    if (!cordova.hasPermission(Manifest.permission.WRITE_EXTERNAL_STORAGE))
      permissionsToRequire.add(Manifest.permission.WRITE_EXTERNAL_STORAGE);
    if (!cordova.hasPermission(Manifest.permission.READ_PHONE_STATE))
      permissionsToRequire.add(Manifest.permission.READ_PHONE_STATE);
    if (!cordova.hasPermission(Manifest.permission.CAMERA))
      permissionsToRequire.add(Manifest.permission.CAMERA);
    String[] _permissionsToRequire = new String[permissionsToRequire.size()];
    _permissionsToRequire = permissionsToRequire.toArray(_permissionsToRequire);
    cordova.requestPermissions(this, REQUEST_CODE, _permissionsToRequire);
  }

  public void onRequestPermissionResult(int requestCode, String[] permissions, int[] grantResults) throws JSONException {
    if (requestCode != REQUEST_CODE)
      return;
    for (int r : grantResults) {
      if (r == PackageManager.PERMISSION_DENIED) {
        Toast.makeText(mContext, "权限被拒绝,请手动打开权限", Toast.LENGTH_SHORT).show();
        return;
      }
    }
    Intent cameraintent = new Intent(cordovaActivity, MemoryCameraActivity.class);
    cameraintent.putExtra("camera", true);
    cordovaInterface.startActivityForResult(this, cameraintent, requestCodeOcr);
  }
}
