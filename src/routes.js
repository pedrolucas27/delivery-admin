import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import AddProduct from './pages/AddProduct';
import AddCategory from './pages/AddCategory';
import AddFlavor from './pages/AddFlavor';
import AddAdditional from './pages/AddAdditional';
import AddPromotion from './pages/AddPromotion';
import AddCoupom from './pages/AddCoupom';
import AddFormPayment from './pages/AddFormPayment';
import Pdv from './pages/Pdv';
import OrderTracking from './pages/OrderTracking';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import RegisterEstablishment from './pages/RegisterEstablishment';
import MyCompany from './pages/MyCompany';
import Products from './pages/Products';
import Categories from './pages/Categories';
import Flavors from './pages/Flavors';
import Additionals from './pages/Additionals';
import Promotions from './pages/Promotions';
import Coupons from './pages/Coupons';
import FormsPayments from './pages/FormsPayments';
import Clients from './pages/Clients';

const Routes = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/addProduct" component={AddProduct} />
                <Route path="/addCategory" component={AddCategory} />
                <Route path="/addFlavor" component={AddFlavor} />
                <Route path="/addAdditional" component={AddAdditional} />
                <Route path="/addPromotion" component={AddPromotion} />
                <Route path="/addCoupom" component={AddCoupom} />
                <Route path="/addFormPayment" component={AddFormPayment} />
                <Route path="/pdv" component={Pdv} />
                <Route path="/orderTracking" component={OrderTracking} />
                <Route path="/dashboard" component={Dashboard} />
                <Route path="/registerEstablishment" component={RegisterEstablishment} />
                <Route path="/myCompany" component={MyCompany} />
                <Route path="/products" component={Products} />
                <Route path="/categories" component={Categories} />
                <Route path="/flavors" component={Flavors} />
                <Route path="/additionals" component={Additionals} />
                <Route path="/promotions" component={Promotions} />
                <Route path="/coupons" component={Coupons} />
                <Route path="/formsPayments" component={FormsPayments} />
                <Route path="/clients" component={Clients} />
                <Route path="/" exact component={Login} />
                <Route path="*" component={NotFound} />
            </Switch>
        </BrowserRouter>
    );
};
export default Routes;