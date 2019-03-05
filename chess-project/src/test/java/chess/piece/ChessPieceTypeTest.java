package chess.piece;

public enum ChessPieceTypeTest {

	PAWN("pawn", "http://i.stack.imgur.com/memI0.png"),
	ROOK("rook", "http://i.stack.imgur.com/memI0.png"),
	KNIGHT("knight", "http://i.stack.imgur.com/memI0.png"),
	BISHOP("bishop", "http://i.stack.imgur.com/memI0.png"),
	QUEEN("queen", "http://i.stack.imgur.com/memI0.png"),
	KING("king", "http://i.stack.imgur.com/memI0.png");

	private final String name;
	private ChessPieceTypeTest(final String name, final String pathToImage) { this.name = name; }
	public String toString() { return name; }
}
