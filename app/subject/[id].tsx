import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, TextInput, Modal, Dimensions } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, FileText, Play, Search, Clock, Eye, X, ChevronDown, ChevronRight, PlayCircle, Pause, RotateCcw, RotateCw } from 'lucide-react-native';
import { sampleSubjects, sampleNotes, sampleVideos } from '@/data/sampleData';
import { theme } from '@/theme';
import { Video, ResizeMode } from 'expo-av';

export default function SubjectPage() {
  const { id } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState<'notes' | 'videos'>('notes');
  const [searchQuery, setSearchQuery] = useState('');
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [expandedUnits, setExpandedUnits] = useState<Set<string>>(new Set());
  const [unitOpen, setUnitOpen] = useState<string | null>(null);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const subject = sampleSubjects.find(s => s.id === id);
  const notes = sampleNotes.filter(note => note.subjectId === id);
  const videos = sampleVideos.filter(video => video.subjectId === id);
  
  // Group videos by units
  const videosByUnit = videos.reduce((acc, video) => {
    if (!acc[video.unit]) {
      acc[video.unit] = [];
    }
    acc[video.unit].push(video);
    return acc;
  }, {} as Record<string, any[]>);
  
  const units = Object.keys(videosByUnit).sort();

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.unit.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredVideos = videos.filter(video =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    video.unit.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleUnit = (unit: string) => {
    const newExpanded = new Set(expandedUnits);
    if (newExpanded.has(unit)) {
      newExpanded.delete(unit);
    } else {
      newExpanded.add(unit);
    }
    setExpandedUnits(newExpanded);
  };

  const playVideo = (video: any) => {
    setSelectedVideo(video);
    setShowVideoPlayer(true);
    setIsPlaying(true);
  };

  const changePlaybackRate = () => {
    const rates = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];
    const currentIndex = rates.indexOf(playbackRate);
    const nextIndex = (currentIndex + 1) % rates.length;
    setPlaybackRate(rates[nextIndex]);
  };

  const renderNoteItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.itemCard}>
      <View style={styles.itemHeader}>
        <View style={styles.itemIcon}>
          <FileText size={20} color={theme.colors.primary} strokeWidth={2.5} />
        </View>
      </View>
      
      <Text style={styles.itemTitle}>{item.title}</Text>
      <Text style={styles.itemUnit}>{item.unit}</Text>
      
      <View style={styles.itemFooter}>
        <View style={styles.viewsContainer}>
          <Eye size={12} color={theme.colors.textMuted} strokeWidth={2} />
          <Text style={styles.viewsText}>245 views</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderVideoItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.videoTopicItem} onPress={() => playVideo(item)}>
      <View style={styles.topicHeader}>
        <PlayCircle size={16} color="#EF4444" strokeWidth={2.5} />
        <Text style={styles.topicTitle}>{item.title}</Text>
      </View>
      <View style={styles.topicMeta}>
        <Clock size={12} color={theme.colors.textMuted} strokeWidth={2} />
        <Text style={styles.topicDuration}>{item.duration}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderUnitSection = (unit: string) => {
    const unitVideos = videosByUnit[unit];
    return (
      <TouchableOpacity key={unit} style={styles.itemCard} onPress={() => setUnitOpen(unit)}>
        <View style={styles.itemHeader}>
          <View style={[styles.itemIcon]}>
            <Play size={20} color={theme.colors.primary} strokeWidth={2.5} />
          </View>
        </View>
        <Text style={styles.itemTitle}>{unit}</Text>
        <Text style={styles.itemUnit}>{unitVideos.length} topics</Text>
      </TouchableOpacity>
    );
  };

  if (!subject) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Subject not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={theme.colors.primary} strokeWidth={2.5} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.subjectName}>{subject.name}</Text>
          <Text style={styles.subjectCode}>{subject.code}</Text>
        </View>
      </View>
      
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Search size={20} color={theme.colors.primary} strokeWidth={2} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search content..."
            placeholderTextColor={theme.colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>
      
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'notes' && styles.activeTab]}
          onPress={() => setActiveTab('notes')}
        >
          <FileText size={18} color={activeTab === 'notes' ? theme.colors.primary : theme.colors.textMuted} strokeWidth={2.5} />
          <Text style={[styles.tabText, activeTab === 'notes' && styles.activeTabText]}>
            Notes ({filteredNotes.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'videos' && styles.activeTab]}
          onPress={() => setActiveTab('videos')}
        >
          <Play size={18} color={activeTab === 'videos' ? theme.colors.primary : theme.colors.textMuted} strokeWidth={2.5} />
          <Text style={[styles.tabText, activeTab === 'videos' && styles.activeTabText]}>
            Videos ({filteredVideos.length})
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        {activeTab === 'notes' ? (
          <FlatList
            data={filteredNotes}
            renderItem={renderNoteItem}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          unitOpen ? (
            <>
              <View style={styles.topicsHeader}>
                <TouchableOpacity onPress={() => setUnitOpen(null)} style={styles.backToUnits}>
                  <ArrowLeft size={18} color={theme.colors.primary} strokeWidth={2.5} />
                  <Text style={styles.backToUnitsText}>Back to Units</Text>
                </TouchableOpacity>
                <Text style={styles.topicsTitle}>{unitOpen} Topics</Text>
              </View>
              <View style={styles.topicsContainer}>
                {videosByUnit[unitOpen].map((video) => (
                  <TouchableOpacity key={video.id} style={styles.videoTopicItem} onPress={() => playVideo(video)}>
                    <View style={styles.topicHeader}>
                      <PlayCircle size={16} color="#EF4444" strokeWidth={2.5} />
                      <Text style={styles.topicTitle}>{video.title}</Text>
                    </View>
                    <View style={styles.topicMeta}>
                      <Clock size={12} color={theme.colors.textMuted} strokeWidth={2} />
                      <Text style={styles.topicDuration}>{video.duration}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          ) : (
            <FlatList
              data={units}
              renderItem={({ item }) => renderUnitSection(item)}
              keyExtractor={(item) => item}
              numColumns={2}
              columnWrapperStyle={styles.row}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
            />
          )
        )}
      </View>

      {/* Video Player Modal */}
      <Modal visible={showVideoPlayer} animationType="slide" presentationStyle="fullScreen">
        <SafeAreaView style={styles.videoPlayerContainer}>
          <View style={styles.videoPlayerHeader}>
            <TouchableOpacity onPress={() => setShowVideoPlayer(false)}>
              <X size={24} color="#ffffff" strokeWidth={2.5} />
            </TouchableOpacity>
            <Text style={styles.videoPlayerTitle} numberOfLines={1}>
              {selectedVideo?.title}
            </Text>
            <View style={{ width: 24 }} />
          </View>
          
          <View style={styles.videoContainer}>
            <Video
              source={{ uri: selectedVideo?.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' }}
              style={styles.video}
              shouldPlay={isPlaying}
              isLooping={false}
              rate={playbackRate}
              resizeMode={ResizeMode.CONTAIN}
            />
          </View>
          
          <View style={styles.videoControls}>
            <TouchableOpacity 
              style={styles.controlButton}
              onPress={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? (
                <Pause size={24} color="#ffffff" strokeWidth={2.5} />
              ) : (
                <PlayCircle size={24} color="#ffffff" strokeWidth={2.5} />
              )}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.controlButton}
              onPress={changePlaybackRate}
            >
              <Text style={styles.playbackRateText}>{playbackRate}x</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.controlButton}
              onPress={() => setPlaybackRate(Math.max(0.5, playbackRate - 0.25))}
            >
              <RotateCcw size={20} color="#ffffff" strokeWidth={2.5} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.controlButton}
              onPress={() => setPlaybackRate(Math.min(2.0, playbackRate + 0.25))}
            >
              <RotateCw size={20} color="#ffffff" strokeWidth={2.5} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: theme.colors.accent,
  },
  backButton: {
    backgroundColor: 'rgba(36, 70, 45, 0.15)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerInfo: {
    flex: 1,
  },
  subjectName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 2,
  },
  subjectCode: {
    fontSize: 14,
    color: theme.colors.primary,
    opacity: 0.7,
  },
  searchContainer: {
    paddingHorizontal: 24,
    paddingTop: 0,
    backgroundColor: theme.colors.accent,
    paddingBottom: 20,
    alignItems: 'center',
  },
  searchBox: {
    backgroundColor: 'rgba(36, 70, 45, 0.15)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    gap: 12,
    width: '100%',
    maxWidth: 400,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.primary,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 4,
    marginTop: 24,
    marginBottom: 24,
  },
  tab: {
    flex: 0.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 22,
    borderRadius: 12,
    gap: 14,
  },
  activeTab: {
    backgroundColor: theme.colors.accent,
    shadowColor: theme.colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textMuted,
  },
  activeTabText: {
    color: theme.colors.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  topicsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  backToUnits: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backToUnitsText: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  topicsTitle: {
    fontSize: 16,
    color: theme.colors.textPrimary,
    fontWeight: '700',
  },
  listContainer: {
    paddingBottom: 12,
  },
  row: {
    justifyContent: 'space-between',
  },
  itemCard: {
    backgroundColor: theme.colors.surface,
    width: '47%',
    padding: 14,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemIcon: {
    width: 36,
    height: 36,
    backgroundColor: theme.colors.accent,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteButton: {
    padding: 4,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: 6,
    lineHeight: 18,
  },
  itemUnit: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginBottom: 12,
  },
  videoMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  durationText: {
    fontSize: 11,
    color: theme.colors.textMuted,
    fontWeight: '500',
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewsText: {
    fontSize: 11,
    color: theme.colors.textMuted,
  },

  errorText: {
    fontSize: 18,
    color: theme.colors.textPrimary,
    textAlign: 'center',
    marginTop: 50,
  },
  videosContainer: {
    paddingBottom: 20,
  },
  unitSection: {
    marginBottom: 16,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    overflow: 'hidden',
  },
  unitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: theme.colors.accent,
  },
  unitTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  unitInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  unitVideoCount: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  topicsContainer: {
    padding: 12,
  },
  videoTopicItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  topicHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  topicTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.textPrimary,
    flex: 1,
  },
  topicMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  topicDuration: {
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  videoPlayerContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  videoPlayerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  videoPlayerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  videoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * 0.6,
  },
  videoControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    gap: 20,
  },
  controlButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  playbackRateText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
});