package chess.piece;

import java.awt.Image;

import javax.swing.ImageIcon;

public abstract class ChessPieceTest extends ImageIcon {
//Currently Empty because svn wouldn't stop complaining when attempting to merge.

	private ChessPieceTypeTest type;
	private Image piece;

	public ChessPieceTest(ChessPieceTypeTest type, Image image) {
		super(image);
		this.type = type;
	}

	public void getMovement() {
		//Will return possibly movement positions
		//Still unsure how to implement
	}

	public ChessPieceTypeTest getType() {
		return type;
	}

	abstract void setType(ChessPieceTypeTest type);
}
