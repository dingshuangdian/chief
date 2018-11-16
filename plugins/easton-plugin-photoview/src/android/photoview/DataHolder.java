package photoview;

import java.util.List;

public class DataHolder {
  private List<String> data;
  public List<String> getData() {
    return data;
  }
  public void setData(List<String> data) {
    this.data = data;
  }
  private static final DataHolder holder = new DataHolder();
  public static DataHolder getInstance() {
    return holder;
  }
}

