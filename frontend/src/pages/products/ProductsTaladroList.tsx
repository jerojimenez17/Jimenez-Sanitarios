
import { IonButton, IonButtons, IonCard, IonCol, IonContent, IonFab, IonFabButton, IonFabList, IonGrid, IonHeader, IonIcon, IonInfiniteScroll, IonInfiniteScrollContent, IonInput, IonItem, IonList, IonMenuButton, IonPage, IonRow, IonSearchbar, IonSplitPane, IonTitle, IonToolbar } from '@ionic/react';
import { add, car, cart, close, logoVimeo, pencil } from 'ionicons/icons';
import { useState, useEffect } from 'react';
import { useHistory, useParams, useRouteMatch } from 'react-router';

import Cart from '../../components/cart/Cart';
import ExploreContainer from '../../components/ExploreContainer';
import Product from "../../interfaces/Product";
import fetchProducts from '../../services/productService';


const ProductsTaladroList: React.FC = () => {

    const { name } = useParams<{ name: string; }>();

    const [products, setProducts] = useState<Product[]>([]);

    const [productsListName, setProductListName] = useState<string>("taladro");

    useEffect(() => {
        fetchProducts(productsListName).then(productsWS =>
            setProducts(productsWS)
        );
    }, [productsListName]);

    const history = useHistory();


    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(100);
    const [searchText, setSearchText] = useState('');

    const [isInfiniteDisabled, setInfiniteDisabled] = useState(false);


    const INITIAL_STATE: Product = {
        id: 0,
        cod: '',
        description: '',
        price: '',}
    const [productToCart,setProductToCart] = useState<Product>(INITIAL_STATE);
     
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

    const loadData = (ev: any) => {
        setTimeout(() => {

            setRowsPerPage(rowsPerPage + 100);
            ev.target.complete();
        }, 500);
    }
    const reloadList=()=>{
        history.push('/page/changeList');
    }
    const addToCart= (product:Product)=>{
        let aux = productToCart;
        
        setProductToCart(aux)
    }
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonMenuButton />
                    </IonButtons>
                    
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen>
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">{name}</IonTitle>
                    </IonToolbar>
                </IonHeader>



                <IonContent>
                    <IonSearchbar className='search-bar' value={searchText} onIonChange={(e: any) => setSearchText(e.detail.value)} placeholder="Buscar..." showCancelButton="focus"></IonSearchbar>

                    <IonCard>
                        <IonTitle className='title'>Lista El Taladro</IonTitle>

                        <IonItem>
                            <IonButton color='primary' fill='solid' slot='end' size='default' onClick={reloadList}>
                                <IonIcon icon={add} />
                                Actualizar lista Taladro
                            </IonButton>
                        </IonItem>
                        
                        <IonGrid className='table'>
                   
                        
                            <IonRow>
                                <IonCol>Codigo</IonCol>
                                <IonCol>Descripcion</IonCol>
                                <IonCol>Precio</IonCol>
                            </IonRow> 
                            {
                             products
                               
                                .filter(
                                    (producto: Product) => {

                                        return (producto.description?.toString().toLocaleLowerCase().includes(searchText.toLocaleLowerCase()) || (producto.cod?.toString().toLocaleLowerCase().includes(searchText.toLocaleLowerCase())))
                                    })
                                .slice(0, rowsPerPage)
                            

                                .map((producto: Product, id: number) =>
    

                                        <IonRow key={producto.cod.toString()} className="fila" >
                                            <IonCol >{producto.cod} </IonCol>
                                            <IonCol>{producto.description}</IonCol>
                                            <IonCol>{"$" + Number(producto.price).toFixed()}</IonCol>
                                            <IonButtons>
                                                <IonButton size='small' fill='solid' color='success' onClick={(e:any)=>{
                                                    setProductToCart(producto);
                                                }}>
                                                    
                                                    <IonIcon icon={add}/>
                                                </IonButton>
                                            </IonButtons>
                                        
                                        </IonRow>
                                

                                )}
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
                </IonContent>





            </IonContent>
        </IonPage>
    );
};

export default ProductsTaladroList;


