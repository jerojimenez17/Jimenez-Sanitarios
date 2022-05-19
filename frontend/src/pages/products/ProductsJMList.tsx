import {
  IonButton,
  IonButtons,
  IonCard,
  IonCol,
  IonContent,
  IonFab,
  IonFabButton,
  IonFabList,
  IonGrid,
  IonHeader,
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonMenuButton,
  IonModal,
  IonPage,
  IonRow,
  IonSearchbar,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
  useIonModal,
} from "@ionic/react";
import { add, cart, close, pencil } from "ionicons/icons";
import { useState, useEffect, useContext } from "react";
import { useHistory, useParams, useRouteMatch } from "react-router";
import Cart from "../../components/cart/Cart";
import ExploreContainer from "../../components/ExploreContainer";
import { CartContext } from "../../context/CartContext";
import CartProvider from "../../context/CartProvider";
import { CartReducer } from "../../context/CartReducer";
import CartState from "../../interfaces/CartState";
import Product from "../../interfaces/Product";
import ProductCart from "../../interfaces/ProductCart";
import fetchProducts from "../../services/productService";

let data: Product[] = require("./jm.json");

const ProductsJMList: React.FC = () => {
  const { name } = useParams<{ name: string }>();

  const history = useHistory();

  const [rowsPerPage, setRowsPerPage] = useState(100);
  const [searchText, setSearchText] = useState("");

  const INITIAL_STATE: Product = {
    id: 0,
    description: "",
    price: "",
    cod: "",
  };

  const [productToCart, setProductToCart] = useState<Product>(INITIAL_STATE);
  const [isInfiniteDisabled, setInfiniteDisabled] = useState(false);

  const [count, setCount] = useState(0);
  const { addItem, cartState } = useContext(CartContext);

  const handleIncrement = () => {
    setCount(count + 1);
  };

  const handleDismiss = () => {
    dismiss();
  };
  /* 
    const search = async ()=> {
        let result = await searchSuppliers();
        setProveedores(result);

    }
   const remove = async(id:string)=>{
        await removeSupplier(id);
        search();
    }
    const addSupplier = () =>{
        history.push('/page/supplier/new')
    }

    const editSupplier = (id:string)=> {
        history.push('/page/supplier/'+id);
    }
    */
  const reloadList = () => {
    history.push("/page/changeList");
  };
  const loadData = (ev: any) => {
    setTimeout(() => {
      setRowsPerPage(rowsPerPage + 100);
      console.log("Cargando Productos...");
      ev.target.complete();
    }, 500);
  };

  const [present, dismiss] = useIonModal(<Cart />, {
    count,

    onDismiss: handleDismiss,
    onIncrement: handleIncrement,
  });
  const openCart = () => {
    history.push("/page/cart");
  };

  const handleAddItemCart = (product: Product) => {
    console.log("Agregando al carrito...");
    addItem(product);
  };
  
  //modal is open
  const [modalOpen,setModalOpen] = useState(false);
  
  const [products, setProducts] = useState<Product[]>([]);

  const [productsListName, setProductListName] = useState<string>("taladro");

  useEffect(() => {
    fetchProducts(productsListName).then((productsWS) =>
      setProducts(productsWS)
    );
  }, [productsListName]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <div>
            <IonButton onClick={()=> setModalOpen(true)}>
              <IonIcon icon={cart} />
            </IonButton>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{name}</IonTitle>
          </IonToolbar>
          <IonTitle size="large" className="title">
            JM
          </IonTitle>
        </IonHeader>

        <IonContent>
          <IonTitle className="listTitle">
            Lista {productsListName.toUpperCase()}
          </IonTitle>
          <IonModal isOpen={modalOpen}>
            <Cart />
          </IonModal>
          <div className="productsSearchContainer">
            <IonSearchbar
              className="search-bar"
              value={searchText}
              onIonChange={(e: any) => setSearchText(e.detail.value)}
              placeholder="Buscar..."
              showCancelButton="focus"
            ></IonSearchbar>
            <IonItem className="selectorLista" color="primary">
              <IonLabel>Seleccione Lista</IonLabel>
              <IonSelect
                onIonChange={(e: any) => setProductListName(e.target.value)}
              >
                <IonSelectOption value="taladro">Taladro</IonSelectOption>
                <IonSelectOption value="jm">JM</IonSelectOption>
                <IonSelectOption value="cerrajeria">Cerrajeria</IonSelectOption>
                <IonSelectOption value="trebol">Trebol</IonSelectOption>
              </IonSelect>
            </IonItem>
          </div>
          <div>
            <IonCard>
              {/* <IonItem>
                <IonButton
                  color="primary"
                  fill="solid"
                  slot="end"
                  size="default"
                  onClick={reloadList}
                >
                  <IonIcon icon={add} />
                  Actualizar lista JM
                </IonButton>
              </IonItem> */}

              <IonGrid className="table">
                <IonRow>
                  <IonCol>Codigo</IonCol>
                  <IonCol>Descripcion</IonCol>
                  <IonCol>Marca</IonCol>
                  <IonCol>Precio</IonCol>
                </IonRow>

                {products

                  .filter((producto: Product) => {
                    return (
                      producto.description
                        ?.toString()
                        .toLocaleLowerCase()
                        .includes(searchText.toLowerCase()) ||
                      producto.cod
                        ?.toString()
                        .toLocaleLowerCase()
                        .includes(searchText.toLowerCase()) ||
                      producto.brand
                        ?.toString()
                        .toLocaleLowerCase()
                        .includes(searchText.toLowerCase())
                    );
                  })
                  .slice(0, rowsPerPage)
                  .map((producto: Product, id: number) => (
                    <IonRow key={producto.cod.toString()} className="fila">
                      <IonCol>{producto.cod} </IonCol>
                      <IonCol className="description">
                        {producto.description}
                      </IonCol>
                      <IonCol className="marca">{producto.brand}</IonCol>
                      <IonCol>
                        {"$" + (Number(producto.price) * 1.5).toFixed()}
                      </IonCol>
                      <IonButtons>
                        <IonButton
                          size="small"
                          fill="solid"
                          color="success"
                          onClick={() => {
                            handleAddItemCart(producto);
                          }}
                        >
                          <IonIcon icon={add} />
                        </IonButton>
                      </IonButtons>
                    </IonRow>
                  ))}
                <IonInfiniteScroll
                  onIonInfinite={loadData}
                  threshold="100px"
                  disabled={isInfiniteDisabled}
                >
                  <IonInfiniteScrollContent
                    loadingSpinner="bubbles"
                    loadingText="Cargando Productos..."
                  ></IonInfiniteScrollContent>
                </IonInfiniteScroll>
              </IonGrid>
            </IonCard>
          </div>
        </IonContent>
      </IonContent>
    </IonPage>
  );
};

export default ProductsJMList;
