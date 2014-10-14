#include "stdafx.h"
#include "ball.h"
//will it works
void Ball::init(int x , int y, int mx , int my , struct Bound * bound)
{
	this->x = x ;
	this->y = y ;
	this->mx = mx ;
	this->my  = my ;
	this->bound = bound ;
}
bool Ball::move(int x1,int x2)
{
	int tmpX , tmpY ;
	tmpX = x + mx ;
	if(tmpX < bound->left)
	{
		tmpX =bound->left + bound->left - tmpX ;
		mx = -mx ;
	}
	else if(tmpX > bound->right)
	{
		tmpX = bound->right - (tmpX - bound->right) ;
		mx = -mx ;
	}
	x = tmpX ;
	tmpY = y + my ;
	if(tmpY < bound->top)
	{
		tmpY = bound->top + bound->top - tmpY ;
		my = - my ;
	}
	//so as the cpp file
	else if(tmpY > bound->bottom)
	{
		if(!isOut(x1,x2))
		{
			tmpY = bound->bottom - (tmpY - bound->bottom) ;
			my = - my ;
		}
		else
		{
			return false ;
		}
	}
	y = tmpY ;
	return true ;
}
bool Ball::isOut(int x1 , int x2)
{
	if(x >= x1 && x <= x2)
	{
		return false ;
	}
	else
	{
		return true ;
	}
}
void Ball::drawBall(CDC * pDC)
{
	
	CPen pen(PS_SOLID,1,RGB(0,0,0)) ;
	pDC->SelectObject(&pen) ;
	CBrush brush(RGB(0,0,0)) ;
	pDC->SelectObject(&brush) ;
	pDC->Ellipse(x-5,y-5,x+5,y+5) ;
}
