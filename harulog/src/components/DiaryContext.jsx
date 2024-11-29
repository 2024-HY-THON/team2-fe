import React, { createContext, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { BASE_URL } from "./BASE_URL";
const DiaryContext = createContext();

export const DiaryProvider = ({ children }) => {
  const [searchContent, setSearchContent] = useState("");
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(0);
  
  const { data: diariesData = [] } = useQuery({
    queryKey: ['diaries'],
    queryFn: async () => {
      const response = await axios.get(`${BASE_URL}/diaries`);
      return response.data;
    }
  });

  const filteredDiaries = diariesData.filter(diary => {
    if (selectedCategoryId === 0) return true;
    return diary.category_id === selectedCategoryId;
  });

  const handleLogoClick = async () => {
    try {
      await queryClient.invalidateQueries(['diaries']);
      navigate("/");
      window.scrollTo(0, 0);
      setSelectedCategoryId(0);
      setSearchContent("");
      console.log({selectedCategoryId});
    } catch (error) {
      console.error("Failed to refresh data:", error);
    }
  };

  const scrollToCategorySection = () => {
    const categorySection = document.getElementById("category-section");
    if (categorySection) {
      const offset = categorySection.offsetTop + 50;
      window.scrollTo({
        top: offset,
        behavior: "smooth",
      });
    }
  };

  const handleCategoryClick = (categoryId) => {
    setSelectedCategoryId(
      selectedCategoryId === categoryId ? null : categoryId
    );
    scrollToCategorySection();
  };

  const handleScroll = () => {
    if (window.scrollY > 330) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  const value = {
    diariesData,
    selectedCategoryId,
    setSelectedCategoryId,
    handleLogoClick,
    searchContent,
    setSearchContent,
    isScrolled,
    handleCategoryClick,
    handleScroll,
    filteredDiaries,
    scrollToCategorySection
  };

  return (
    <DiaryContext.Provider value={value}>{children}</DiaryContext.Provider>
  );
};

export const useDiaryContext = () => {
  const context = useContext(DiaryContext);
  if (!context) {
    throw new Error("useDiaryContext must be used within a DiaryProvider");
  }
  return context;
};