#ifndef BALL_H
#define BALL_H
//the first commets

struct Bound
{
	int top ;
	int left ;
	int right ;
	int bottom ;
} ;
// to insert some comments
class Ball
{
private:
	int x ; //pos
	int y ;
	int mx ; // addtion
	int my ;
	struct Bound *bound ;
public :
	void init(int x, int y ,int mx , int my , struct Bound *bound) ;
	bool move(int x1 , int x2) ;
	bool isOut(int x1 , int x2) ;
	void drawBall(CDC * pDC) ;

} ;

#endif
