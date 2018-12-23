package chiefdownload;

import android.app.AlertDialog;
import android.app.Dialog;
import android.content.Context;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;


public class VersionUtils {

    private static String TAG = "VersionUtils";


    //获取App版本名
    public static String getVersionName(Context context) {
        return getPackageInfo(context).versionName;
    }

    //获取App版本号
    public static int getVersionCode(Context context) {
        return getPackageInfo(context).versionCode;
    }

    //获取App版本号
    public static String getPackageName(Context context) {
        return getPackageInfo(context).packageName;
    }

    private static PackageInfo getPackageInfo(Context context) {
        PackageInfo pi = null;

        try {
            PackageManager pm = context.getPackageManager();
            pi = pm.getPackageInfo(context.getPackageName(),
                    PackageManager.GET_CONFIGURATIONS);

            return pi;
        } catch (Exception e) {
            e.printStackTrace();
        }

        return pi;
    }




    Dialog dialog1;
    public void qiangzhi(Context context){
        AlertDialog.Builder builder1 = new AlertDialog.Builder(context);
        builder1.setMessage("后台更新，请稍后...\n更新后请安装新版本");
        builder1.setCancelable(false);
        dialog1=builder1.create();
        dialog1.show();
    }


    public void canceledDialog() {
        if(dialog1!=null && dialog1.isShowing()){
            dialog1.dismiss();
        }
    }






}
