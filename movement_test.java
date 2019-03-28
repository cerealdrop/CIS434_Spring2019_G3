package chess_game;

import java.awt.Canvas;
import java.awt.Cursor;
import java.awt.Dimension;
import java.awt.Frame;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.Image;
import java.awt.Toolkit;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.awt.event.WindowAdapter;
import java.awt.event.WindowEvent;
import java.net.URL;


public class movement_test extends Frame{

	public void main(String[] args) {
		new movement_test();
	}

	movement_test() {
		super("Testing");
		addWindowListener(new WindowAdapter() {
			public void windowClosing(WindowEvent e) {System.exit(0);}
		});
		setSize(1200, 900);
		add("Center", new test_move2());
		setCursor(Cursor.getPredefinedCursor(Cursor.CROSSHAIR_CURSOR));
		setVisible(true);
	}



class test_move2 extends Canvas {
	int centerX, centerY, currentX, currentY;
	float pixelSize, xP = 1e9F, yP, rWidth = 100.0F, rHeight = 100.0F;


	test_move2() {
		addMouseListener(new MouseAdapter() {
			public void mousePressed(MouseEvent evt) {
				xP = fx(evt.getX()); yP = fy(evt.getY());
				repaint();
			}
		});
	}

	void initgr() {
		Dimension d = getSize();
		int maxX = d.width - 1, maxY = d.height - 1;
		pixelSize = Math.max(rWidth / maxX, rHeight / maxY);
		centerX = maxX / 2; centerY = maxY / 2;
	}

	int iX(float x) {return Math.round(centerX + x / pixelSize);}
	int iY(float y) {return Math.round(centerY - y / pixelSize);}
	float fx(int x) {return (x - centerX) * pixelSize;}
	float fy(int y) {return (centerY - y) * pixelSize;}

	void moveTo(float x, float y) {
		currentX = iX(x); currentY = iY(y);
	}

	public Image getImage(String path) {
		Image temp = null;
		try {
			URL imageurl = movement_test.class.getResource(path);
			temp = Toolkit.getDefaultToolkit().getImage(imageurl);
		} catch (Exception e) {
			System.out.println("error -" +e.getMessage());
		}

		return temp;
	}

	public void paint(Graphics g) {
		initgr();

		Image piece = null;
		if(piece==null)
			piece = getImage("white pawn.png");

		Graphics2D g2 = (Graphics2D)g;
		g2.drawImage(piece, iX(xP), iY(yP), null);

	}

}
}
