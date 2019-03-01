package chess.game;

import javafx.application.Application;
import javafx.geometry.HPos;
import javafx.geometry.VPos;
import javafx.scene.Scene;
import javafx.scene.control.Control;
import javafx.scene.layout.ColumnConstraints;
import javafx.scene.layout.GridPane;
import javafx.scene.layout.Priority;
import javafx.scene.layout.RowConstraints;
import javafx.scene.layout.StackPane;
import javafx.stage.Stage;

public class ChessTest extends Application {

	@Override
	public void start(Stage stage) {

		GridPane root = new GridPane();

		int size = 8 ;
		for (int row = 0; row < size; row++)
			for (int col = 0; col < size; col ++) {
				StackPane square = new StackPane();
				square.setScaleX(1);
				square.setScaleY(1);
				square.setScaleShape(true);
				String color ;
				if ((row + col) % 2 == 0) {
					color = "white";
				} else {
					color = "black";
				}
				square.setStyle("-fx-background-color: "+color+";");
				root.add(square, col, row);
			}

		for (int i = 0; i < size; i++) {
			root.getColumnConstraints().add(new ColumnConstraints(5, Control.USE_COMPUTED_SIZE, Double.POSITIVE_INFINITY, Priority.ALWAYS, HPos.CENTER, true));
			root.getRowConstraints().add(new RowConstraints(5, Control.USE_COMPUTED_SIZE, Double.POSITIVE_INFINITY, Priority.ALWAYS, VPos.CENTER, true));
		}
		stage.setScene(new Scene(root, 400, 400));
		stage.show();
	}

	public static void main(String[] args) {
		launch(args);
	}
}