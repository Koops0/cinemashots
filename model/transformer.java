import android.content.Context;
import com.google.android.gms.tasks.Task;
import org.tensorflow.lite.task.core.Task;

public class Transformer {

    private Context context;

    public Transformer(Context context) {
        this.context = context;
    }

    public Task<Void> initialize() {
        return TfLite.initialize(context);
    }
}