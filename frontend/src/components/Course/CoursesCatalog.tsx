import React from 'react';
import { BookOpen, Clock, PlayCircle } from 'lucide-react';
import { Heading, Text } from '../DesignSystem/Typography';
import { Card } from '../DesignSystem/Card';
import { Button } from '../DesignSystem/Button';
import { api, UserCourse } from '@/src/lib/api';

export const CoursesCatalog = ({
  courses,
  isLoading,
  error,
  onOpenRoadmap,
  onOpenCourse,
  authToken,
  onRefreshCourses,
}: {
  courses: UserCourse[];
  isLoading: boolean;
  error: string | null;
  onOpenRoadmap: () => void;
  onOpenCourse: (course: UserCourse) => void;
  authToken: string | null;
  onRefreshCourses: () => Promise<void>;
}) => {
  const [completingId, setCompletingId] = React.useState<string | null>(null);
  const [actionError, setActionError] = React.useState<string | null>(null);

  const handleComplete = async (entry: UserCourse) => {
    if (!authToken) return;
    setCompletingId(entry.id);
    setActionError(null);
    try {
      await api.completeCourse(authToken, { course_id: entry.id });
      await onRefreshCourses();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to mark course as complete.');
    } finally {
      setCompletingId(null);
    }
  };

  if (isLoading) {
    return <Text>Loading your courses...</Text>;
  }

  if (error) {
    return <Text className="text-red-500">{error}</Text>;
  }

  if (!courses.length) {
    return (
      <Card className="p-10 text-center space-y-4">
        <Heading as="h3">No Courses Yet</Heading>
        <Text className="text-text-secondary">
          Generate your roadmap first, then create courses for modules.
        </Text>
        <Button variant="primary" onClick={onOpenRoadmap}>
          Open Roadmap
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <Heading as="h1">My <span className="text-gradient">Courses</span></Heading>
          <Text className="text-text-secondary">Personalized content generated for your profile.</Text>
        </div>
        <Button variant="outline" onClick={onOpenRoadmap}>Generate More</Button>
      </div>
      {actionError && <Text className="text-red-500">{actionError}</Text>}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {courses.map((entry) => (
          <Card key={entry.id} className="p-6 space-y-4 border-border-light bg-white hover:shadow-xl transition-all">
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 rounded-xl bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-brand-purple" />
              </div>
              <span className="text-[10px] uppercase tracking-widest font-bold text-brand-pink">
                {new Date(entry.created_at).toLocaleDateString()}
              </span>
            </div>
            <Heading as="h4" className="text-lg">{entry.course.title || entry.module_name}</Heading>
            <Text className="text-sm text-text-secondary line-clamp-2">
              Built from module: {entry.module_name}
            </Text>
            <div className="flex items-center justify-between text-xs text-text-secondary">
              <span className="flex items-center gap-1">
                <PlayCircle className="w-3.5 h-3.5" />
                Lessons: {entry.course.lessons.length}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Self-paced
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <Text className="text-xs text-text-secondary">
                {entry.is_completed ? 'Completed' : 'Not completed'}
              </Text>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => onOpenCourse(entry)}>
                  Open Course
                </Button>
                <Button
                  variant={entry.is_completed ? 'outline' : 'primary'}
                  size="sm"
                  onClick={() => handleComplete(entry)}
                  disabled={Boolean(entry.is_completed) || completingId === entry.id || !authToken}
                >
                  {entry.is_completed ? 'Completed' : completingId === entry.id ? 'Updating...' : 'Mark Complete'}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
