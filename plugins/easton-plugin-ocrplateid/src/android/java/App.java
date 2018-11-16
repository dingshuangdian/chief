package ocrplateid;

import android.support.multidex.MultiDex;
import android.support.multidex.MultiDexApplication;


/**
 * Created by lvping on 2017/8/31.
 */

public class App extends MultiDexApplication {

  @Override
  public void onCreate() {
    super.onCreate();
    MultiDex.install(this);

  }
}
