package chiefdownload;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.os.Handler;
import android.os.IBinder;
import android.os.Message;
import android.support.v4.app.NotificationCompat;
import android.support.v4.content.FileProvider;
import android.util.Log;
import android.widget.Toast;
import com.zhy.http.okhttp.OkHttpUtils;
import com.zhy.http.okhttp.callback.FileCallBack;
import java.io.File;
import okhttp3.Call;

public class UpdateService extends Service {
  /* public static final String DOWN_APK_URL = "http://dm.chiefchain.com:80/apks/ChiefStore.apk";          //下载地址
   public static final String STORGE_PATH=Environment.getExternalStorageDirectory()+"/com.luochen.test/";//存储路径
   public static final String APK_NAME = "ChiefStore.apk";                                               //APK名字
*/
  public String down_apk_url;          //下载地址
  public static final String STORGE_PATH = Environment.getExternalStorageDirectory() + "/czbang/apks/";//存储路径
  public static final String APK_NAME = "ChiefStore.apk";                                               //APK名字
  private static final String TAG = UpdateService.class.getSimpleName();
  private Handler handler = new Handler() {
    @Override
    public void handleMessage(Message msg) {
      super.handleMessage(msg);
      switch (msg.what) {
        case 1:
          showNotificationProgress(msg.arg1);
          break;
        case 2:
          //安装apk
          //   installApk();
          break;
      }
    }
  };
  private int currentProgress = 0;
  private NotificationManager manager;

  //ProgressDialog progressDialog;
  @Override
  public IBinder onBind(Intent intent) {
    // TODO: Return the communication channel to the service.
    throw new UnsupportedOperationException("Not yet implemented");
  }

  @Override
  public void onCreate() {
    super.onCreate();
    Log.e(TAG, "---------------onCreate:" + STORGE_PATH + APK_NAME);
    manager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
//    progressDialog = new ProgressDialog(DownloadPlugin.getActivity());
//    progressDialog.setTitle("正在下载...");
//    progressDialog.setCanceledOnTouchOutside(false);
//    progressDialog.setProgressStyle(ProgressDialog.STYLE_HORIZONTAL);
  }

  @Override
  public int onStartCommand(Intent intent, int flags, int startId) {
    if (intent != null) {
      down_apk_url = intent.getStringExtra("url");
    }
    //启动分线程下载
    new Thread(new Runnable() {
      @Override
      public void run() {
        okHttpDownLoadApk(down_apk_url);
      }
    }).start();
    return super.onStartCommand(intent, flags, startId);
  }

  /**
   * 联网下载最新版本apk
   */
  private void okHttpDownLoadApk(final String url) {
    if (FileUtil.fileIsExists(STORGE_PATH + APK_NAME)) {
      FileUtil.deleteAllFiles(new File(STORGE_PATH));
    }

    OkHttpUtils
      .get()
      .url(url)
      .build()// Environment.getExternalStorageDirectory().getAbsolutePath() 存储路径
      .execute(new FileCallBack(STORGE_PATH, APK_NAME) {
        @Override
        public void onError(Call call, Exception e, int id) {
          Log.e(TAG, "onError :" + e.getMessage());
        }

        @Override
        public void onResponse(File response, int id) {
          //Log.e(TAG, "onResponse() 当前线程 == " + Thread.currentThread().getName());
        }

        @Override
        public void inProgress(final float progress, long total, int id) {
          super.inProgress(progress, total, id);
          int pro = (int) (100 * progress);
          //解决pro进度重复传递 progress的问题 这里解决UI界面卡顿问题
          if (currentProgress < pro && pro <= 100) {

            currentProgress = pro;
            Message msg = new Message();
            msg.what = 1;
            msg.arg1 = currentProgress;
            handler.sendMessage(msg);
          }
        }
      });
  }

  //  private void showDownloadDialog(int progress) {
//
//    progressDialog.show();
//    progressDialog.setProgress(progress);
//    if (progress == 100) {
//      progressDialog.dismiss();//关闭进度条
//      //下载完成后自动安装apk
//      installApk();
//    }
//  }
  private void showNotificationProgress(int progress) {
    Notification.Builder builder = creatNotification("车仆下载", "当前下载进度: " + progress + "%");
    int AllProgress = 100;
    builder.setDefaults(NotificationCompat.FLAG_ONLY_ALERT_ONCE);
    builder.setAutoCancel(false);//用户点击后自动删除
    builder.setProgress(AllProgress, progress, false); //AllProgress最大进度 //progress 当前进度
    manager.notify(0, builder.build());
    //notification.flags = Notification.FLAG_AUTO_CANCEL;
    if (progress == 100) {
      if (manager != null) {
        manager.cancel(0);//下载完毕 移除通知栏
      }
      //下载完成后自动安装apk
      installApk();
    }
  }

  private Notification.Builder creatNotification(String title, String msg) {
    Notification.Builder builder = new Notification.Builder(this)
      .setAutoCancel(false)
      .setContentTitle(title)
      .setContentText(msg)
      .setSmallIcon(this.getResources().getIdentifier("icon",
        "mipmap", this.getPackageName()))
      .setLargeIcon(BitmapFactory.decodeResource(getResources(), this.getResources().getIdentifier("icon",
        "mipmap", this.getPackageName())));//App大图标
    //适配8.0以上通知栏
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      //第三个参数设置通知的优先级别
      NotificationChannel channel =
        new NotificationChannel("channel_id", "app_msg", NotificationManager.IMPORTANCE_DEFAULT);
      channel.canBypassDnd();//是否可以绕过请勿打扰模式
      channel.canShowBadge();//是否可以显示icon角标
      channel.enableLights(true);//是否显示通知闪灯
      channel.enableVibration(true);//收到小时时震动提示
      channel.setBypassDnd(true);//设置绕过免打扰
      channel.setLightColor(Color.RED);//设置闪光灯颜色
      channel.getAudioAttributes();//获取设置铃声设置
      channel.setVibrationPattern(new long[]{0});//设置震动模式
      channel.shouldShowLights();//是否会闪光
      manager.createNotificationChannel(channel);
      builder.setChannelId("channel_id");//这个id参数要与上面channel构建的第一个参数对应
    }
    return builder;
  }

  /**
   * 安装apk
   * 1.需要判断手机版本 5.0 6.0 7.0
   */
  private Intent intentInstall = null;

  private void installApk() {
    if (intentInstall == null) {
      intentInstall = new Intent(Intent.ACTION_VIEW);
    }
    if (Build.VERSION.SDK_INT >= 24) {
      File file = new File(STORGE_PATH, APK_NAME);
      //参数1 上下文, 参数2 Provider主机地址 和配置文件中保持一致   参数3  共享的文件
      Uri uri = FileProvider.getUriForFile(getApplicationContext(),
        VersionUtils.getPackageName(getApplicationContext()) + ".provider", file);//"com.example.luochen.installapkdemo.provider", file);
      if (uri == null) {
        Toast.makeText(getApplicationContext(), "APK已经下载", Toast.LENGTH_SHORT).show();
        return;
      }
      intentInstall.setDataAndType(uri, "application/vnd.android.package-archive");
      intentInstall.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
      intentInstall.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
      startActivity(intentInstall);
      //System.exit(0);
    } else {
      //如果是3.0 以上
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.HONEYCOMB) {
        File fileLocation = new File(STORGE_PATH, APK_NAME);
        intentInstall.addCategory("android.intent.category.DEFAULT");
        intentInstall.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        intentInstall.setDataAndType(Uri.fromFile(fileLocation), "application/vnd.android.package-archive");
        startActivity(intentInstall);
        //System.exit(0);
      } else {
        Toast.makeText(getApplicationContext(), "APK已经下载", Toast.LENGTH_SHORT).show();
      }
    }
    //停止服务
    stopSelf();
  }

  @Override
  public void onDestroy() {
    super.onDestroy();
    if (manager != null) {
      manager.cancel(0);//下载完毕 移除通知栏
    }
//    if (progressDialog.isShowing()) {
//      progressDialog.dismiss();
//    }
  }
}

