package assignments;

import java.awt.Component;
import java.awt.Dimension;
import java.awt.LayoutManager;

import javax.swing.JPanel;

public class ChessBoard extends JPanel {

	private static final long serialVersionUID = 7182437068179544811L;

	public ChessBoard(LayoutManager layout) {
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