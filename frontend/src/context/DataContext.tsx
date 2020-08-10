import React, {
  createContext,
  useCallback,
  useState,
  useEffect,
  useContext,
} from 'react';
import PropTypes from 'prop-types';

import api from '../services/api';

interface PostData {
  _id: string;
  title: string;
  description: string;
  type: string;
  imageURL: string;
  videoURL: string;
  textEnglish: string;
  textPortuguese: string;
  summary: string;
  category: CategoryData;
}

interface CategoryData {
  _id: string;
  title: string;
  description: string;
  imageURL: string;
}

interface CategoryResponse {
  page: number;
  totCategories: number;
  categories: CategoryData[];
}

interface PostResponse {
  page: number;
  totPosts: number;
  posts: PostData[];
}

interface ContextData {
  posts: PostData[];
  categories: CategoryData[];
  isLoaded: boolean;
  loadedPosts: boolean;
  loadedCategories: boolean;
  handlePaginationCategories(): void;
  handlePaginationPosts(): void;
  isLastPostPage(): boolean;
  isLastCategoriesPage(): boolean;
  getPostById(id: string): Promise<PostData>;
  getCategoryById(id: string): Promise<CategoryData>;
  deletePostById(id: string): void;
  deleteCategoryById(id: string): void;
}

const DataContext = createContext<ContextData>({} as ContextData);

export const DataProvider: React.FC = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [loadedPosts, setLoadedPosts] = useState<boolean>(true);
  const [loadedCategories, setLoadedCategories] = useState<boolean>(true);

  const [posts, setPosts] = useState<PostResponse>({
    page: 1,
    totPosts: 0,
    posts: [],
  });

  const [categories, setCategories] = useState<CategoryResponse>({
    page: 1,
    totCategories: 0,
    categories: [],
  });

  useEffect(() => {
    const loadData = async (): Promise<void> => {
      const responsePosts = await api.get<PostResponse>('/posts');
      const responseCategories = await api.get<CategoryResponse>('/categories');

      setPosts(responsePosts.data);
      setCategories(responseCategories.data);
      setIsLoaded(true);
    };
    loadData();
  }, []);

  const handlePaginationCategories = useCallback(async () => {
    setLoadedCategories(false);
    const currentPage = categories.page;

    const response = await api.get('/categories', {
      params: {
        page: Number(currentPage) + 1,
      },
    });

    const { page, totCategories, categories: newCategories } = response.data;

    setCategories({
      page,
      totCategories,
      categories: [...categories.categories, ...newCategories],
    });
    setLoadedCategories(true);
  }, [categories.categories, categories.page]);

  const handlePaginationPosts = useCallback(async () => {
    setLoadedPosts(false);
    const currentPage = posts.page;

    const response = await api.get<PostResponse>('/posts', {
      params: {
        page: Number(currentPage) + 1,
      },
    });

    const { page, totPosts, posts: newPosts } = response.data;

    setPosts({
      page,
      totPosts,
      posts: [...posts.posts, ...newPosts],
    });
    setLoadedPosts(true);
  }, [posts.posts, posts.page]);

  const isLastPostPage = useCallback(
    () => posts.totPosts === posts.posts.length,
    [posts.totPosts, posts.posts.length],
  );

  const isLastCategoriesPage = useCallback(
    () => categories.totCategories === categories.categories.length,
    [categories.totCategories, categories.categories.length],
  );

  const getPostById = useCallback(async (id: string) => {
    const response = await api.get<PostData>(`/posts/${id}`);

    return response.data;
  }, []);

  const getCategoryById = useCallback(async (id: string) => {
    const response = await api.get<CategoryData>(`/categories/${id}`);

    return response.data;
  }, []);

  const deletePostById = useCallback(
    (id: string) => {
      const updatedPosts = posts.posts.filter((post) => post._id !== id);
      setPosts({
        ...posts,
        posts: updatedPosts,
      });
    },
    [posts],
  );

  const deleteCategoryById = useCallback(
    (id: string) => {
      const updatedCategories = categories.categories.filter(
        (post) => post._id !== id,
      );
      setCategories({
        ...categories,
        categories: updatedCategories,
      });
    },
    [categories],
  );

  return (
    <DataContext.Provider
      value={{
        posts: posts.posts,
        categories: categories.categories,
        isLoaded,
        loadedPosts,
        loadedCategories,
        handlePaginationCategories,
        handlePaginationPosts,
        isLastPostPage,
        isLastCategoriesPage,
        getPostById,
        getCategoryById,
        deletePostById,
        deleteCategoryById,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export function useData(): ContextData {
  const context = useContext(DataContext);

  if (!context) {
    throw new Error('useData must be used within an AuthProvider');
  }

  return context;
}

DataProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
