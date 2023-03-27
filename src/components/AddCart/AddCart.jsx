import styles from './AddCart.module.css';

import React from 'react';
import Portal from '../Portal/Portal';
import { Counter } from '../Counter/Counter';
import { useState, useEffect } from 'react';
import { priceTemplate } from '@/utils/priceTemplate';
import { useRecoilState, useSetRecoilState } from 'recoil';
import {
  addExistProduct,
  cartListState,
  lastAddProductState,
} from '@/@store/cartListState';

export function AddCart({ data, onClose }) {
  const [countNum, setCountNum] = useState(data.stock);
  const [cartList, setCartList] = useRecoilState(cartListState);
  const [lastProduct, setLastProduct] = useRecoilState(lastAddProductState);
  const addItem = useSetRecoilState(addExistProduct);

  const newItem = {
    type: data.type,
    title: data.name,
    src: data.image.thumbnail,
    alt: data.image.alt,
    price: data.price,
    salePrice: data.salePrice,
    stock: countNum,
    isChecked: true,
  };

  const handleMinus = () => {
    setCountNum(countNum - 1);
  };

  const handlePlus = () => {
    setCountNum(countNum + 1);
  };

  const addCart = () => {
    const titleList = [];
    cartList.map((product) => {
      titleList.push(product.title);
    });
    if (titleList.includes(newItem.title)) {
      addItem([newItem.title, countNum]);
    } else {
      setCartList([...cartList, { ...newItem }]);
    }
    setLastProduct(newItem);
  };

  useEffect(() => {
    document.body.style.cssText = `
      position: fixed; 
      top: -${window.scrollY}px;
      overflow-y: scroll;
      width: 100%;`;
    return () => {
      const scrollY = document.body.style.top;
      document.body.style.cssText = '';
      window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
    };
  }, []);

  return (
    <Portal elementId="modal__root">
      <div className={styles['Overlay']}>
        <div>
          <h2 className={styles['a11y-hidden']}>장바구니 담기</h2>
          <div className={styles['add-cart-container']}>
            <div className={styles['product-amount-wrapper']}>
              <span className={styles['product-name']}>{data.name}</span>
              <div className={styles['price-counter-wrapper']}>
                {data.saleRatio ? (
                  <div>
                    <span className={styles['product-price']}>
                      {priceTemplate(data.price * (1 - data.saleRatio))}원
                    </span>
                    <span className={styles['original-price']}>
                      {priceTemplate(data.price)}원
                    </span>
                  </div>
                ) : (
                  <span className={styles['product-price']}>
                    {priceTemplate(data.price)}원
                  </span>
                )}

                <div className={styles['counter-box']}>
                  <Counter
                    quantity={countNum}
                    onClickPlus={handlePlus}
                    onClickMinus={handleMinus}
                  />
                </div>
              </div>
            </div>

            <div className={styles['total-price-wrapper']}>
              <span className={styles['total-price']}>합계</span>
              {data.saleRatio ? (
                <span className={styles['total-price-number']}>
                  {priceTemplate(data.price * (1 - data.saleRatio) * countNum)}
                  원
                </span>
              ) : (
                <span className={styles['total-price-number']}>
                  {priceTemplate(data.price * countNum)}원
                </span>
              )}
              <div className={styles['saving-wrapper']}>
                <span className={styles['saving']}>적립</span>
                {data.saleRatio ? (
                  <span className={styles['saving-price']}>
                    구매 시{' '}
                    {priceTemplate(
                      Math.floor(
                        data.price * (1 - data.saleRatio) * countNum * 0.01
                      )
                    )}
                    원 적립
                  </span>
                ) : (
                  <span className={styles['saving-price']}>
                    구매 시{' '}
                    {priceTemplate(Math.floor(data.price * countNum * 0.001))}원
                    적립
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={onClose}
              className={styles['cancle-btn']}
              type="button"
            >
              취소
            </button>
            <button
              onClick={() => {
                addCart();
                onClose();
              }}
              className={styles['add-cart-btn']}
              type="button"
            >
              장바구니 담기
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}
