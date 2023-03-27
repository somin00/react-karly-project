import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import styles from './Header.module.css';
import logo from '@/assets/header/logo.svg';
import location from '@/assets/header/location.png';
import heart from '@/assets/header/heart.png';
import cart from '@/assets/header/cart.png';
import newIcon from '@/assets/header/Vector.png';
import search from '@/assets/header/Search.png';
import close from '@/assets/header/Close.png';
import bar from '@/assets/header/bar.png';
import { Category } from './Category/Category';
import { ScrollNav } from './ScrollNav/ScrollNav';
import { NormalNav } from './NormalNav/NormalNav';
import { throttle } from '../../utils/throttle';
// 유림 추가
import { useRecoilState } from 'recoil';
import { getAuth, signOut } from 'firebase/auth';
import {
  isLoggedInState,
  emailState,
  passwordState,
  cartListState,
  lastAddProductState,
} from '@/@store';
// -------------------------
import CartAddedModal from '../ProductDetail/ProductDetailItem/CartAddedModal/CartAddedModal';
import { useDidMountEffect } from '@/hooks/useDidMountEffect';
export const Header = (props) => {
  // 유림 추가
  const auth = getAuth();
  const [email, setEmail] = useRecoilState(emailState);
  const [password, setPassword] = useRecoilState(passwordState);
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(isLoggedInState);

  const logout = async () => {
    try {
      await signOut(auth);
      setEmail('');
      setPassword('');
      setIsLoggedIn(false);
    } catch (err) {
      console.error(err);
    }
  };
  // -----------------------
  const [cartList, setCartList] = useRecoilState(cartListState);
  const [lastProduct, setLastProduct] = useRecoilState(lastAddProductState);
  const didMount = useRef(false);

  const [isShow, setIsShow] = useState(false);

  const [isScrolled, setIsScrolled] = useState(false);
  const [isShowBanner, setIsShowBanner] = useState(true);

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleCloseBanner = () => {
    setIsShowBanner(false);
  };
  const toggleShow = () => {
    setIsShow(true);
    setTimeout(() => {
      setIsShow(false);
    }, 2000);
  };
  useDidMountEffect(toggleShow, [lastProduct]);

  const handleScroll = throttle(() => {
    if (window.scrollY > document.querySelector('header').offsetHeight - 60) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  }, 20);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return (
    <header className={styles.container}>
      {isShowBanner && (
        <div className={styles['banner-wrapper']}>
          <div className={styles['banner-box']}>
            <p>
              지금 가입하고 인기상품<span> 100원</span> 에 받아가세요!
            </p>
            <button onClick={handleCloseBanner}>
              <img src={close} alt="배너 닫기" width="42" height="42" />
            </button>
          </div>
        </div>
      )}
      <div className={styles.wrapper}>
        <section className={styles.member}>
          <ul className={styles['member-wrapper']}>
            {/* 유림 추가 */}
            {isLoggedIn ? (
              <li onClick={logout} className={styles.logout}>
                로그아웃
              </li>
            ) : (
              <>
                {pathname === '/signup' ? (
                  <li className={styles.selected}>
                    <Link to="/signup">회원가입</Link>
                  </li>
                ) : (
                  <li>
                    <Link to="/signup">회원가입</Link>
                  </li>
                )}
                {pathname === '/login' ? (
                  <li className={styles.selected}>
                    <Link to="/login">로그인</Link>
                  </li>
                ) : (
                  <li>
                    <Link to="/login">로그인</Link>
                  </li>
                )}
              </>
            )}
            {/* 유림 추가 */}
            <li>고객센터</li>
          </ul>
        </section>
        <section className={styles['header-main']}>
          <div>
            <Link to="/">
              <img src={logo} alt="칼리 로고" width="82" height="42" />
            </Link>
            <button type="button" className={styles.market}>
              마켓컬리
            </button>
            <img src={bar} alt="" width="1" height="14" />
            <button type="button" className={styles.beauty}>
              뷰티컬리
              <img
                src={newIcon}
                alt=""
                width="7"
                height="7"
                className={styles.new}
              />
            </button>
          </div>
          <div className={styles['search-box']}>
            <label htmlFor="검색창" className={styles['a11y-hidden']}>
              검색창
            </label>
            <input
              className={styles['search-input']}
              placeholder="검색어를 입력해주세요"
            />
            <img
              src={search}
              alt="검색하기"
              className={styles['search-icon']}
            />
          </div>
          <div className={styles['quick-menu']}>
            <span>
              <img src={location} alt="배송지 등록" width="36" height="36" />
            </span>
            <span>
              <img src={heart} alt="찜하기" width="36" height="36" />
            </span>
            <div className={styles['cart-box']}>
              <Link to="/cart">
                <img src={cart} alt="장바구니" width="36" height="36" />
              </Link>
              {cartList.length !== 0 && (
                <span className={styles['cart-number']}>{cartList.length}</span>
              )}
              {isShow && <CartAddedModal />}
            </div>
          </div>
        </section>
        {isScrolled ? <ScrollNav isShow={isShow} /> : <NormalNav />}
      </div>
    </header>
  );
};
