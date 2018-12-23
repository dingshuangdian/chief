package chiefchain;



import android.os.Bundle;



public class CXActivity extends MyCordovaActivity {


  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    // enable Cordova apps to be started in the background
    Bundle extras = getIntent().getExtras();
    if (extras != null && extras.getBoolean("cdvStartInBackground", false)) {
      moveTaskToBack(true);
    }
    loadUrl(launchUrl);

  }
}








