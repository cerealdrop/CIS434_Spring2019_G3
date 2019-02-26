package assignments;

import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.GridBagLayout;
import java.awt.GridLayout;
import java.awt.Insets;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.image.BufferedImage;

import javax.swing.ImageIcon;
import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JToolBar;

public class ChessFrame extends JFrame {

	private static final long serialVersionUID = -3696647324328401992L;

	private JButton[][] chessSquares = new JButton[8][8];

	private JButton current;
	private ChessBoard chessBoard;

	private static JLabel message = new JLabel("Sample Chess");

	public static void main(String[] args) {

		ChessFrame frame = new ChessFrame();
		frame.setVisible(true);
	}

	public ChessFrame() {
		super("Chess Frame");

		// set up the main GUI
		JToolBar tools = new JToolBar();
		tools.setFloatable(false);
		add(tools, BorderLayout.PAGE_START);

		chessBoard = new ChessBoard(new GridLayout(0, 8));
		chessBoard.setBackground(Color.DARK_GRAY);

		//Preserves shape of the chess board
		JPanel boardConstrain = new JPanel(new GridBagLayout());
		boardConstrain.setBackground(Color.LIGHT_GRAY);
		boardConstrain.add(chessBoard);
		add(boardConstrain);

		//create the chess board squares
		Insets buttonMargin = new Insets(0, 0, 0, 0);
		for (int row = 0; row < 8; row++) {
			for (int col = 0; col < 8; col++) {
				JButton button = new JButton();
				button.setMargin(buttonMargin);

				ImageIcon icon = new ImageIcon(new BufferedImage(64, 64, BufferedImage.TYPE_INT_ARGB));
				button.setIcon(icon);
				button.addActionListener(new TileSpace());
				
				if ((row - col) % 2 == 0) {
					button.setBackground(Color.WHITE);
				} else {
					button.setBackground(Color.BLACK);
				}
				chessSquares[col][row] = button;
				chessBoard.add(button);
			}
		}
		NewGameAction newGameAction = new NewGameAction("New", chessSquares);
		tools.add(newGameAction);
		tools.add(new JButton("Save"));
		tools.add(new JButton("Restore"));
		tools.addSeparator();
		tools.add(new JButton("Resign"));
		tools.addSeparator();
		tools.add(message);

		setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
		setLocationByPlatform(true);
		pack();
		setMinimumSize(getSize());
	}

	private class TileSpace implements ActionListener {

		@Override
		public void actionPerformed(ActionEvent e) {
			JButton button = (JButton) e.getSource();
			if (current == null) {
				if (button.getIcon() != null) {
					current = button;
				}
			} else if (button.getX() != current.getX() || button.getY() != current.getY()){
				button.setIcon(current.getIcon());
				current.setIcon(null);
				current = null;
			} else {
				current = null;
			}
		}
	}
}