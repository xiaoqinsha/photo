import cv2
import numpy
from matplotlib import pyplot


if __name__ == '__main__':
    imgobj1 = cv2.imread('12306.png')

    hist1 = cv2.calcHist([imgobj1], [0], None, [256], [0.0, 255.0])
    pyplot.plot(range(256), hist1, 'r')
    pyplot.show()
    cv2.imshow('img1', imgobj1)
    cv2.waitKey(0)

    # 灰度
    gray = cv2.cvtColor(imgobj1, cv2.COLOR_BGR2GRAY)
    cv2.imshow('img2', gray)

    img = cv2.imread("12306.png", cv2.IMREAD_GRAYSCALE)
    cv2.imwrite('12306.Grayscale.png', img)

    cv2.waitKey(0)

    # 二值
    img = cv2.imread("12306.png")
    Grayimg = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    ret, thresh = cv2.threshold(Grayimg, 150, 255, cv2.THRESH_BINARY)
    cv2.imwrite('12306.BINARY.png', thresh)
