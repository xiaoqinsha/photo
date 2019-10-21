import cv2
import numpy
from matplotlib import pyplot


if __name__ == '__main__':
    imgobj = cv2.imread('12306.1.png', cv2.IMREAD_GRAYSCALE)
    rows = imgobj.shape[0]
    cols = imgobj.shape[1]

    print(imgobj.shape)

    # 第一行应该就高度25
    part01 = imgobj[0:25, 0:cols-53]

    #cv2.imshow('part1', part01)
    cv2.imwrite('messigray.png', part01)
    # cv2.waitKey(0)

    # 下面是8个图形
    for i in range(2):
        for j in range(4):
            print(i, j)
            part02 = imgobj[26+81*i:26+81*(i+1), 75*j:75+75*j]
            #cv2.imshow('part1', part02)
            cv2.imwrite('messigray.' + str(i) + '.' + str(j) + '.png', part02)
            # cv2.waitKey(0)

    cv2.waitKey(0)
