import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import AddProduct from './pages/AddProduct';
import AddCategory from './pages/AddCategory';
import AddFlavor from './pages/AddFlavor';
import AddSize from './pages/AddSize';
import AddAdditional from './pages/AddAdditional';
import AddPromotion from './pages/AddPromotion';

import Pdv from './pages/Pdv';

import Products from './pages/Products';
import Categories from './pages/Categories';
import Flavors from './pages/Flavors';
import Sizes from './pages/Sizes';
import Additionals from './pages/Additionals';
import Promotions from './pages/Promotions';

function Routes() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/addProduct" component={AddProduct} />
                <Route path="/addCategory" component={AddCategory} />
                <Route path="/addFlavor" component={AddFlavor} />
                <Route path="/addSize" component={AddSize} />
                <Route path="/addAdditional" component={AddAdditional} />
                <Route path="/addPromotion" component={AddPromotion} />

                <Route path="/pdv" component={Pdv} />

                <Route path="/products" component={Products} />
                <Route path="/categories" component={Categories} />
                <Route path="/flavors" component={Flavors} />
                <Route path="/sizes" component={Sizes} />
                <Route path="/additionals" component={Additionals} />
                <Route path="/promotions" component={Promotions} />
            </Switch>
        </BrowserRouter>
    );
};

export default Routes;
