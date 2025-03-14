import { useEffect, useState, useRef, useMemo } from 'react';
import { useRestfulCustomAxios } from '@/shared/hooks/useRestfulCustomAxios';
import { showNotification } from '@/shared/utils/common-helper';
import { useRecoilValue } from 'recoil';
import { roomStatusState } from '@/shared/store/onpromise';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const animationStyle = `
  @keyframes typingFadeIn {
    0% { opacity: 0; transform: translateX(-10px); }
    50% { opacity: 0.5; transform: translateX(0); }
    100% { opacity: 1; }
  }
  
  .animate-typingFadeIn {
    display: inline-block;
    animation: typingFadeIn 2s ease-out forwards;
    opacity: 0;
  }
  
  .delay-100 { animation-delay: 0.1s; }
  .delay-200 { animation-delay: 0.2s; }
  .delay-300 { animation-delay: 0.3s; }
  .delay-400 { animation-delay: 0.4s; }
  .delay-500 { animation-delay: 0.5s; }
`;

const ChatroomDateList: React.FC<ChatroomDateListProps> = ({ onSelectChatroom, conversations }) => {
  const { sendRequest } = useRestfulCustomAxios();
  const [chatroomGroups, setChatroomGroups] = useState<ChatroomGroup[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [newItemIds, setNewItemIds] = useState<number[]>([]);
  const prevGroupsRef = useRef<ChatroomGroup[]>([]);
  const initialLoadRef = useRef<boolean>(false);
  const roomStatus = useRecoilValue(roomStatusState);

  const getChatroomsByDate = async (isInitial = false) => {
    if (isInitial) {
      setIsInitialLoading(true);
    } else {
      setIsUpdating(true);
    }

    try {
      const response = await sendRequest(`/chatroom/date/2`, 'get');
      if (response && response.data) {
        if (response.data.code === 'F000') {
          prevGroupsRef.current = chatroomGroups;

          const newIds: number[] = [];

          if (!isInitial && prevGroupsRef.current.length > 0) {
            response.data.data.groups.forEach((group: ChatroomGroup) => {
              group.chatrooms.forEach((chatroom) => {
                const isNew = !prevGroupsRef.current.some((g) => g.chatrooms.some((r) => r.id === chatroom.id));
                if (isNew) {
                  newIds.push(chatroom.id);
                }
              });
            });
          }

          if (isInitial) {
            setChatroomGroups(response.data.data.groups);
          } else {
            mergeNewData(response.data.data.groups);
            setNewItemIds(newIds);
          }
        } else if (response.data.code === 'F002') {
          showNotification(response.data.message, 'error');
        } else {
          showNotification('채팅방 기록을 불러오는데 실패했습니다.', 'error');
        }
      }
    } catch (error) {
      showNotification('채팅방 기록을 불러오는데 오류가 발생했습니다.', 'error');
      console.error('Error fetching chatroom data:', error);
    } finally {
      if (isInitial) {
        setIsInitialLoading(false);
      } else {
        setIsUpdating(false);

        setTimeout(() => {
          setNewItemIds([]);
        }, 2000);
      }
    }
  };

  const mergeNewData = (newGroups: ChatroomGroup[]) => {
    setChatroomGroups((prevGroups) => {
      if (!prevGroups || prevGroups.length === 0) return [...newGroups];

      return newGroups.map((newGroup) => {
        const mergedGroup = { ...newGroup };
        const existingGroup = prevGroups.find((prevGroup) => prevGroup.date_label === newGroup.date_label);

        if (!existingGroup) return mergedGroup;

        const mergedChatrooms: Chatroom[] = [];

        newGroup.chatrooms.forEach((newRoom) => {
          mergedChatrooms.push({ ...newRoom });
        });
        existingGroup.chatrooms.forEach((existingRoom) => {
          const roomExists = mergedChatrooms.some((room) => room.id === existingRoom.id);
          if (!roomExists) {
            mergedChatrooms.push({ ...existingRoom });
          }
        });
        mergedGroup.chatrooms = mergedChatrooms;
        return mergedGroup;
      });
    });
  };

  // const mergeNewData = (newGroups: ChatroomGroup[]) => {
  //   setChatroomGroups((prevGroups) => {
  //     if (!prevGroups || prevGroups.length === 0) return newGroups;

  //     return newGroups.map((newGroup) => {
  //       const existingGroup = prevGroups.find((prevGroup) => prevGroup.date_label === newGroup.date_label);

  //       if (!existingGroup) return newGroup;
  //       const mergedChatrooms = [...existingGroup.chatrooms];
  //       newGroup.chatrooms.forEach((newRoom) => {
  //         const existingRoomIndex = mergedChatrooms.findIndex((room) => room.id === newRoom.id);

  //         if (existingRoomIndex >= 0) {
  //           mergedChatrooms[existingRoomIndex] = newRoom;
  //         } else {
  //           mergedChatrooms.push(newRoom);
  //         }
  //       });

  //       return {
  //         ...newGroup,
  //         chatrooms: mergedChatrooms,
  //       };
  //     });
  //   });
  // };

  const isNewItem = (chatroom: Chatroom) => {
    return newItemIds.includes(chatroom.id);
  };

  const memoizedChatroomGroups = useMemo(() => chatroomGroups, [chatroomGroups]);

  useEffect(() => {
    if (!initialLoadRef.current) {
      getChatroomsByDate(true);
      initialLoadRef.current = true;
    }
  }, []);

  useEffect(() => {
    if (initialLoadRef.current && roomStatus.state && chatroomGroups.length > 0) {
      getChatroomsByDate(false);
    }
  }, [roomStatus.state]);

  const truncateText = (text: string, maxLength = 15) => {
    if (!text) return '';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  const handleChatroomClick = (chatroomId: number) => {
    if (onSelectChatroom) {
      onSelectChatroom(chatroomId);
    }
  };

  const getAnimationDelay = (index: number): string => {
    const delays = ['delay-100', 'delay-200', 'delay-300', 'delay-400', 'delay-500'];
    return delays[index % delays.length] || '';
  };

  if (isInitialLoading) {
    return (
      <div className="p-4 overflow-y-auto">
        <p className="text-sx font-bold mb-2">로딩 중...</p>
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={`loading_${index}`} className="mb-1">
            <Skeleton height={24} />
          </div>
        ))}
      </div>
    );
  }

  if (memoizedChatroomGroups.length === 0) {
    return (
      <div className="p-4 overflow-y-auto">
        <p className="text-sx font-bold mb-2">채팅 기록이 없습니다</p>
      </div>
    );
  }

  return (
    <>
      <style>{animationStyle}</style>

      <div className="p-4 overflow-y-auto mb-20">
        {memoizedChatroomGroups.map((group: ChatroomGroup, groupIndex: number) => (
          <div key={`group_${group.date_label}_${groupIndex}`} className="mt-6 mb-2 first:mt-0">
            <p className="text-sx font-bold">{group.date_label}</p>
            <ul className="space-y-1 ml-2">
              {group.chatrooms.map((chatroom, chatroomIndex) => {
                const isNew = isNewItem(chatroom);
                const delayClass = isNew ? getAnimationDelay(chatroomIndex) : '';

                return (
                  <li
                    key={`chatroom_${chatroom.id}_${chatroomIndex}`}
                    className={`cursor-pointer hover:text-primary ${isNew ? `animate-typingFadeIn ${delayClass}` : ''}`}
                    onClick={() => handleChatroomClick(chatroom.id)}
                  >
                    {truncateText(chatroom.title)}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
};

export default ChatroomDateList;
