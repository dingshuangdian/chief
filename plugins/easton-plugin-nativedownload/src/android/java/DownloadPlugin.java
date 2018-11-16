package chiefdownload;

import android.Manifest;
import android.app.Activity;
import android.app.AlertDialog;
import android.app.Dialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Build;
import android.view.KeyEvent;
import android.widget.Toast;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
public class DownloadPlugin extends CordovaPlugin {
  private static Activity cordovaActivity;
  private static Context mContext;
  private String url;
  public CordovaInterface cordovaInterface;
  @Override
  public void initialize(CordovaInterface cordova, CordovaWebView webView) {
    super.initialize(cordova, webView);
    cordovaActivity = cordova.getActivity();
    cordovaInterface = cordova;
    mContext = cordova.getActivity().getApplication();
  }
  /**
   * 安卓6以上动态权限相关
   */
  private static final int REQUEST_CODE = 100001;
  private boolean needsToAlertForRuntimePermission() {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
      return !cordova.hasPermission(Manifest.permission.WRITE_EXTERNAL_STORAGE);
    } else {
      return false;
    }
  }
  @Override
  public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
    if (action.equals("downloadStart")) {
      JSONObject jsonObject = args.getJSONObject(0);
      url = jsonObject.optString("path");
      ininPermision(url);
    }
    return true;
  }
  private void ininPermision(String url) {
    if (!needsToAlertForRuntimePermission()) {
      forbidden();
      Intent updateService = new Intent(cordovaActivity, UpdateService.class);
      updateService.putExtra("url", url);
      cordovaActivity.startService(updateService);
    } else {
      requestPermission();
    }
  }
  private void requestPermission() {
    ArrayList<String> permissionsToRequire = new ArrayList<String>();
    if (!cordova.hasPermission(Manifest.permission.WRITE_EXTERNAL_STORAGE))
      permissionsToRequire.add(Manifest.permission.WRITE_EXTERNAL_STORAGE);
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
    forbidden();
    Intent updateService = new Intent(cordovaActivity, UpdateService.class);
    updateService.putExtra("url", url);
    cordovaActivity.startService(updateService);
  }

  Dialog dialog;

  public void forbidden() {
    AlertDialog.Builder builder = new AlertDialog.Builder(cordovaActivity);
    builder.setMessage("锁定操作,后台更新,请稍后...");
    builder.setCancelable(false);
    dialog = builder.create();
    dialog.show();
    dialog.setOnKeyListener(new DialogInterface.OnKeyListener() {
      @Override
      public boolean onKey(DialogInterface dialog, int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_BACK && event.getRepeatCount() == 0) {
          return true;
        } else {
          return false;
        }
      }
    });
  }
}
