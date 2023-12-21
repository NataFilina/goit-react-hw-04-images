import React, { PureComponent } from 'react';
import { Triangle } from 'react-loader-spinner';
import { Searchbar } from './Searchbar/Searchbar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import * as ImageService from '../service/images';
import { ImageGalleryItem } from './ImageGalleryItem/ImageGalleryItem';
import { Button } from './Button/Button';

export class App extends PureComponent {
  state = {
    searchName: '',
    page: 1,
    images: [],
    isLoading: false,
    error: null,
    isEmpty: false,
    isVisible: false,
  };
  handlerOnSubmit = value => {
    this.setState({
      searchName: value,
      page: 1,
      images: [],
      error: null,
      isEmpty: false,
    });
  };
  getPhotos = async (searchName, page) => {
    if (!searchName) return;
    this.setState({ isLoading: true });
    try {
      const { hits, totalHits } = await ImageService.getImages(
        searchName,
        page
      );
      if (hits.length === 0) {
        this.setState({ isEmpty: true });
      }
      this.setState(prevState => ({
        images: [...prevState.images, ...hits],
        isVisible: page < Math.ceil(totalHits / 12),
      }));
    } catch (error) {
      this.setState({ error: alert(`OOPS! Something went wrong: ${error}`) });
    } finally {
      this.setState({ isLoading: false });
    }
  };
  componentDidUpdate(prevProps, prevState) {
    const { searchName, page } = this.state;
    if (prevState.searchName !== searchName || prevState.page !== page) {
      this.getPhotos(searchName, page);
    }
  }
  onLoadMore = () => {
    this.setState(prevState => ({ page: prevState.page + 1, isLoading: true }));
  };

  render() {
    const { images, isVisible, isEmpty, error, isLoading } = this.state;
    return (
      <>
        <Searchbar onSubmit={this.handlerOnSubmit} />
        {isEmpty && <h2>Sorry, there are no images...</h2>}
        {error && <h2>Something went wrong - {error}</h2>}

        <ImageGallery children={<ImageGalleryItem images={images} />} />
        {isVisible && !isLoading && images.length > 0 && (
          <Button
            onClick={this.onLoadMore}
            children={isLoading ? 'Loading' : 'Load more'}
          />
        )}
        {isLoading && (
          <Triangle
            height="80"
            width="80"
            color="#4fa94d"
            ariaLabel="triangle-loading"
            wrapperStyle={{ marginLeft: '50%' }}
            wrapperClassName=""
            visible={true}
          />
        )}
      </>
    );
  }
}
