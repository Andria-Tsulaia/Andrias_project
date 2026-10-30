import { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";

import { Layout } from "./components/layout/Layout";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";

import Catalog from "./pages/catalog";
const Cart = lazy(() => import("./pages/cart"));
const Checkout = lazy(() => import("./pages/checkout"));
const CheckoutConfirm = lazy(() => import("./pages/checkout-confirm"));
const ForgotPassword = lazy(() => import("./pages/forgot-password"));
const Login = lazy(() => import("./pages/login"));
const NotFound = lazy(() => import("./pages/not-found"));
const OrderDetail = lazy(() => import("./pages/order-detail"));
const Orders = lazy(() => import("./pages/orders"));
const Product = lazy(() => import("./pages/product"));
const Profile = lazy(() => import("./pages/profile"));
const Register = lazy(() => import("./pages/register"));

export const routers = [
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, name: "home", element: <Navigate to="catalog" replace /> },
      { 
        path: "catalog", 
        name: "catalog", 
        element: (
          <Suspense fallback={<div>იტვირთება...</div>}>
            <Catalog />
          </Suspense>
        ) 
      },
      { 
        path: "product/:slug", 
        name: "product", 
        element: (
          <Suspense fallback={<div>იტვირთება...</div>}>
            <Product />
          </Suspense>
        ) 
      },
      { path: "login", name: "login", element: <Suspense fallback={<div>იტვირთება...</div>}><Login /></Suspense> },
      { path: "register", name: "register", element: <Suspense fallback={<div>იტვირთება...</div>}><Register /></Suspense> },
      { path: "forgot-password", name: "forgot-password", element: <Suspense fallback={<div>იტვირთება...</div>}><ForgotPassword /></Suspense> },
      {
        name: "protected",
        element: <ProtectedRoute />,
        children: [
          { 
            path: "cart", 
            name: "cart", 
            element: (
              <Suspense fallback={<div>იტვირთება...</div>}>
                <Cart />
              </Suspense>
            ) 
          },
          { path: "checkout", name: "checkout", element: <Suspense fallback={<div>იტვირთება...</div>}><Checkout /></Suspense> },
          { path: "checkout/confirm/:orderId", name: "checkout-confirm", element: <Suspense fallback={<div>იტვირთება...</div>}><CheckoutConfirm /></Suspense> },
          { path: "orders", name: "orders", element: <Suspense fallback={<div>იტვირთება...</div>}><Orders /></Suspense> },
          { path: "orders/:id", name: "order-detail", element: <Suspense fallback={<div>იტვირთება...</div>}><OrderDetail /></Suspense> },
          { path: "profile", name: "profile", element: <Suspense fallback={<div>იტვირთება...</div>}><Profile /></Suspense> },
        ],
      },
    ],
  },
  {
    path: "*",
    element: (
      <Suspense fallback={<div>იტვირთება...</div>}>
        <NotFound />
      </Suspense>
    ),
  },
];