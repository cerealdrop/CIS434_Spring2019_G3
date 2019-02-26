package chess.game;

import java.awt.Image;
import java.awt.event.ActionEvent;
import java.awt.image.BufferedImage;
import java.net.URL;

import javax.imageio.ImageIO;
import javax.swing.AbstractAction;
import javax.swing.ImageIcon;
import javax.swing.JButton;

public class NewGameAction extends AbstractAction {

	private static final long serialVersionUID = -3419790992687122262L;

	private JButton[][] chessSquares = new JButton[8][8];
	private Image[][] chessImages = new Image[2][6];

	private static int QUEEN = 0, KING = 1, ROOK = 2, KNIGHT = 3, BISHOP = 4, PAWN = 5;
	private static int[] STARTING_ROW = {ROOK, KNIGHT, BISHOP, KING, QUEEN, BISHOP, KNIGHT, ROOK};
	private static int BLACK = 0, WHITE = 1;

	public NewGameAction(String text, JButton[][] buttons) {
		super(text);
		chessSquares = buttons;
		createImages();
	}

	@Override
	public void actionPerformed(ActionEvent e) {
		setupNewGame();
	}

	//displays the icons of the chess pieces
	private void setupNewGame() {

		//reset board
		for (int i = 0; i < STARTING_ROW.length; i++)
			for (int j = 0; j < STARTING_ROW.length; j++)
				chessSquares[j][i].setIcon(null);

		//black pieces
		for (int i = 0; i < STARTING_ROW.length; i++)
			chessSquares[i][0].setIcon(new ImageIcon(chessImages[BLACK][STARTING_ROW[i]]));
		for (int i = 0; i < STARTING_ROW.length; i++)
			chessSquares[i][1].setIcon(new ImageIcon(chessImages[BLACK][PAWN]));

		//white pieces
		for (int i = 0; i < STARTING_ROW.length; i++)
			chessSquares[i][6].setIcon(new ImageIcon(chessImages[WHITE][PAWN]));
		for (int i = 0; i < STARTING_ROW.length; i++)
			chessSquares[i][7].setIcon(new ImageIcon(chessImages[WHITE][STARTING_ROW[i]]));
	}

	private void createImages() {

		try {
			URL url = new URL("http://i.stack.imgur.com/memI0.png");
			BufferedImage bi = ImageIO.read(url);
			for (int col = 0; col < 2; col++) {
				for (int row = 0; row < 6; row++) {
					chessImages[col][row] = bi.getSubimage(row * 64, col * 64, 64, 64);
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
			System.exit(1);
		}
	}
}