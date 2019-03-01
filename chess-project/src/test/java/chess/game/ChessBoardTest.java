package chess.game;
//Modified experimental build based on code found online (not for primary use in current state)
import java.awt.Component;
import java.awt.Dimension;
import java.awt.LayoutManager;

import javax.swing.JPanel;

public class ChessBoardTest extends JPanel {

	private static final long serialVersionUID = 7182437068179544811L;

	public ChessBoardTest(LayoutManager layout) {
		super(layout);
	}

	@Override
	public Dimension getPreferredSize() {

		Dimension dim = super.getPreferredSize();
		int length = (int) Math.min(dim.getWidth(), dim.getHeight());

		Component c = getParent();
		if (c != null) {
			int size = Math.max(length, (int) Math.min(c.getWidth(), c.getHeight()));
			return new Dimension(size, size);
		}
		return new Dimension(length, length);
	}
}
