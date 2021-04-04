import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import AddProduct from './pages/AddProduct';
import AddCategory from './pages/AddCategory';
import AddFlavor from './pages/AddFlavor';
import AddSize from './pages/AddSize';

import Products from './pages/Products';
import Categories from './pages/Categories';
import Flavors from './pages/Flavors';
import Sizes from './pages/Sizes';

function Routes() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/addProduct" component={AddProduct} />
                <Route path="/addCategory" component={AddCategory} />
                <Route path="/addFlavor" component={AddFlavor} />
                <Route path="/addSize" component={AddSize} />

                <Route path="/products" component={Products} />
                <Route path="/categories" component={Categories} />
                <Route path="/flavors" component={Flavors} />
                <Route path="/sizes" component={Sizes} />
            </Switch>
        </BrowserRouter>
    );
};

export default Routes;
