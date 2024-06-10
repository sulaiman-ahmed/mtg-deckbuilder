import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { Card } from '../types';
import { fetchCards, processImportText } from '../utils/cardUtils';

export const useCardManager = () => {
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [cards, setCards] = useState<Card[]>([]);
    const [selectedCards, setSelectedCards] = useState<Card[]>([]);
    const [nextPage, setNextPage] = useState<string | null>(null);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(false);

  
    useEffect(() => {
      const savedSearchQuery = Cookies.get('searchQuery');
      const savedScrollPosition = Cookies.get('scrollPosition');
      const savedCards = Cookies.get('savedCards');
  
      if (savedSearchQuery) {
        setSearchQuery(savedSearchQuery);
        fetchCards(savedSearchQuery).then(response => {
          setCards(response.data);
          setNextPage(response.next_page || null);
          setHasMore(response.has_more);
        });
      }
  
      if (savedScrollPosition) {
        window.scrollTo(0, parseInt(savedScrollPosition));
      }
  
      if (savedCards) {
        setSelectedCards(JSON.parse(savedCards));
      }
    }, []);
  
    useEffect(() => {
      Cookies.set('searchQuery', searchQuery, { expires: 1 });
    }, [searchQuery]);
  
    useEffect(() => {
      Cookies.set('savedCards', JSON.stringify(selectedCards), { expires: 1 });
    }, [selectedCards]);
  
    const handleSearch = async (searchQuery: string) => {
        const response = await fetchCards(searchQuery);
        setCards(response.data);
        setNextPage(response.next_page || null);
        setHasMore(response.has_more);
      };
  
      const handleLoadMoreResults = async () => {
        if (nextPage) {
          setLoadingMore(true);
          const response = await fetchCards(searchQuery, parseInt(nextPage.split('page=')[1]));
          setCards(prevCards => [...prevCards, ...response.data]);
          setNextPage(response.next_page || null);
          setHasMore(response.has_more);
          setLoadingMore(false);
        }
      };
  
    const handleAddCard = (card: Card) => {
      setSelectedCards(prevCards => {
        const existingCardIndex = prevCards.findIndex(c => c.name === card.name);
        if (existingCardIndex !== -1) {
          const updatedCards = [...prevCards];
          updatedCards[existingCardIndex].count += 1;
          return updatedCards;
        }
        return [...prevCards, { ...card, count: 1 }];
      });
    };
  
    const handleAddMultipleCards = (card: Card, count: number) => {
      setSelectedCards(prevCards => {
        const existingCardIndex = prevCards.findIndex(c => c.name === card.name);
        if (existingCardIndex !== -1) {
          const updatedCards = [...prevCards];
          updatedCards[existingCardIndex].count += count;
          return updatedCards;
        }
        return [...prevCards, { ...card, count }];
      });
    };
  
    const handleRemoveCard = (index: number) => {
      setSelectedCards(prevCards => {
        const updatedCards = [...prevCards];
        updatedCards[index].count -= 1;
        if (updatedCards[index].count <= 0) {
          updatedCards.splice(index, 1);
        }
        return updatedCards;
      });
    };
  
    const handleImportCards = async (importText: string) => {
      const fetchedCards = await processImportText(importText);
      setSelectedCards(prevCards => {
        const updatedCards = [...prevCards];
        fetchedCards.forEach(card => {
          const existingCardIndex = updatedCards.findIndex(c => c.name === card.name);
          if (existingCardIndex !== -1) {
            updatedCards[existingCardIndex].count += card.count;
          } else {
            updatedCards.push(card);
          }
        });
        return updatedCards;
      });
    };
  
    return {
      searchQuery,
      setSearchQuery,
      cards,
      selectedCards,
      loadingMore,
      hasMore,
      handleSearch,
      handleLoadMoreResults,
      handleAddCard,
      handleAddMultipleCards,
      handleRemoveCard,
      handleImportCards,
    };
  };