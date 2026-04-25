import React, { useEffect, useMemo, useState } from 'react';
import { Clock, ArrowRight, RotateCcw, Dna, Brain, Target, Gauge } from 'lucide-react';
import { Heading, Text } from '../DesignSystem/Typography';
import { Button } from '../DesignSystem/Button';
import { Card } from '../DesignSystem/Card';
import { PageTransition } from '../DesignSystem/Transitions';
import { api, DnaQuestion, DnaSubmitResponse } from '@/src/lib/api';
import { cn } from '@/src/lib/utils';

type QuizStep = 'intro' | 'active' | 'results';

export const QuizInterface = ({
  onComplete,
  userLevel = 'Undergraduate',
  authToken,
}: {
  onComplete: (results?: any) => void;
  userLevel?: 'School' | 'Undergraduate';
  authToken: string | null;
}) => {
  const [step, setStep] = useState<QuizStep>('intro');
  const [questions, setQuestions] = useState<DnaQuestion[]>([]);
  const [level, setLevel] = useState('');
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answers, setAnswers] = useState<string[]>([]);
  const [timeTaken, setTimeTaken] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(7);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DnaSubmitResponse | null>(null);
  const [isAutoAdvancing, setIsAutoAdvancing] = useState(false);

  const currentQuestion = questions[currentQuestionIdx];
  const mappedLevel = useMemo(
    () => (userLevel === 'School' ? 'class_10' : 'btech_3'),
    [userLevel]
  );

  useEffect(() => {
    if (step !== 'active' || !questions.length) return;
    if (timeLeft <= 0) {
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [step, timeLeft, questions.length]);

  useEffect(() => {
    if (step !== 'active' || timeLeft > 0 || isLoading || isAutoAdvancing) return;
    setIsAutoAdvancing(true);
    handleNext(true).finally(() => setIsAutoAdvancing(false));
  }, [step, timeLeft, isLoading, isAutoAdvancing]);

  useEffect(() => {
    if (step !== 'active' || selectedAnswer === null || isLoading || isAutoAdvancing) return;
    const advanceTimer = setTimeout(() => {
      setIsAutoAdvancing(true);
      handleNext(false).finally(() => setIsAutoAdvancing(false));
    }, 250);
    return () => clearTimeout(advanceTimer);
  }, [step, selectedAnswer, isLoading, isAutoAdvancing]);

  const handleStart = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.fetchQuestions(mappedLevel);
      setQuestions(response.questions);
      setLevel(response.level);
      setCurrentQuestionIdx(0);
      setAnswers([]);
      setTimeTaken([]);
      setSelectedAnswer(null);
      setTimeLeft(7);
      setStep('active');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load quiz questions.');
    } finally {
      setIsLoading(false);
    }
  };

  const submitAndFinish = async (nextAnswers: string[], nextTimes: number[]) => {
    if (!authToken) {
      setError('Please login again to submit your DNA.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const submitResponse = await api.submitDna(authToken, {
        answers: nextAnswers,
        time_taken: nextTimes,
        level,
      });
      localStorage.setItem('latest_dna_profile', JSON.stringify(submitResponse.profile));
      setResult(submitResponse);
      setStep('results');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit DNA.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = async (isTimeout = false) => {
    const answer = selectedAnswer ?? '';
    const elapsed = isTimeout ? 7 : Math.max(1, 7 - timeLeft);
    const nextAnswers = [...answers, answer];
    const nextTimes = [...timeTaken, elapsed];
    setAnswers(nextAnswers);
    setTimeTaken(nextTimes);

    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx((idx) => idx + 1);
      setSelectedAnswer(null);
      setTimeLeft(7);
      return;
    }

    await submitAndFinish(nextAnswers, nextTimes);
  };

  if (step === 'intro') {
    return (
      <div className="max-w-2xl mx-auto py-20 px-6">
        <PageTransition>
          <Card className="text-center p-12 space-y-8">
            <div className="w-20 h-20 rounded-full bg-brand-pink/10 flex items-center justify-center mx-auto border border-brand-pink/20">
              <img src="/image.png" alt="EduDNA Logo" className="w-32 h-auto animate-pulse" />
            </div>
            <div className="space-y-3">
              <Heading as="h1">Start Your <span className="text-gradient">DNA Mapping</span></Heading>
              <Text className="text-text-secondary">Quiz questions will be fetched from your backend profile level.</Text>
            </div>
            {error && <Text className="text-red-500">{error}</Text>}
            <Button variant="primary" className="w-full py-4 text-lg" onClick={handleStart} disabled={isLoading}>
              {isLoading ? 'Loading Questions...' : 'Initialize Mapping'}
            </Button>
          </Card>
        </PageTransition>
      </div>
    );
  }

  if (step === 'results' && result) {
    const normalizedAccuracy = Math.max(0, Math.min(100, result.accuracy));
    const speedScore = Math.max(0, Math.min(100, Math.round((14 - result.avg_time_per_question) * 10)));
    return (
      <div className="max-w-4xl mx-auto py-12 px-6 space-y-8">
        <Card className="p-10 space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-pink/10 flex items-center justify-center">
              <Brain className="w-5 h-5 text-brand-pink" />
            </div>
            <Heading as="h2">Learning <span className="text-gradient">DNA Profile</span></Heading>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl border border-border-light bg-gray-50 space-y-3">
              <div className="flex items-center justify-between text-sm font-semibold">
                <span className="flex items-center gap-2"><Target className="w-4 h-4 text-brand-pink" /> Accuracy</span>
                <span>{result.accuracy}%</span>
              </div>
              <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
                <div
                  className="h-full bg-gradient-premium transition-all duration-700"
                  style={{ width: `${normalizedAccuracy}%` }}
                />
              </div>
              <Text className="text-xs text-text-secondary">Based on your correct answers.</Text>
            </div>

            <div className="p-5 rounded-2xl border border-border-light bg-gray-50 space-y-3">
              <div className="flex items-center justify-between text-sm font-semibold">
                <span className="flex items-center gap-2"><Gauge className="w-4 h-4 text-brand-purple" /> Speed Score</span>
                <span>{speedScore}%</span>
              </div>
              <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 transition-all duration-700"
                  style={{ width: `${speedScore}%` }}
                />
              </div>
              <Text className="text-xs text-text-secondary">Avg time: {result.avg_time_per_question}s / question</Text>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl border border-emerald-200 bg-emerald-50/60 space-y-2">
              <Heading as="h4" className="text-base">Strengths</Heading>
              {result.profile.strengths.length ? (
                <div className="flex flex-wrap gap-2">
                  {result.profile.strengths.map((item) => (
                    <span key={item} className="px-3 py-1 rounded-full text-xs font-semibold bg-white border border-emerald-200 text-emerald-700">
                      {item}
                    </span>
                  ))}
                </div>
              ) : (
                <Text className="text-sm text-text-secondary">No strengths identified yet.</Text>
              )}
            </div>

            <div className="p-5 rounded-2xl border border-amber-200 bg-amber-50/60 space-y-2">
              <Heading as="h4" className="text-base">Weaknesses</Heading>
              {result.profile.weaknesses.length ? (
                <div className="flex flex-wrap gap-2">
                  {result.profile.weaknesses.map((item) => (
                    <span key={item} className="px-3 py-1 rounded-full text-xs font-semibold bg-white border border-amber-200 text-amber-700">
                      {item}
                    </span>
                  ))}
                </div>
              ) : (
                <Text className="text-sm text-text-secondary">No weakness identified yet.</Text>
              )}
            </div>
          </div>

          <Text className="text-sm">
            Learning Style: <strong>{result.profile.learningStyle}</strong>
          </Text>

          <div className="flex gap-4 pt-2">
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => {
                setStep('intro');
                setResult(null);
                setError(null);
              }}
            >
              <RotateCcw className="w-4 h-4" /> Recalibrate DNA
            </Button>
            <Button
              variant="primary"
              className="gap-2"
              onClick={() =>
                onComplete({
                  accuracy: result.accuracy,
                  score: Math.round((result.accuracy / 100) * 5),
                  categories: {},
                  learningStyle: result.profile.learningStyle,
                  strengths: result.profile.strengths,
                })
              }
            >
              Initialize Dashboard <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <Card className="p-8 space-y-8">
        <div className="flex items-center justify-between">
          <Text className="font-bold">Question {currentQuestionIdx + 1}/{questions.length}</Text>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-brand-pink" />
            <span className={cn('font-mono font-bold', timeLeft <= 3 ? 'text-rose-500' : 'text-text-primary')}>
              {timeLeft}s
            </span>
          </div>
        </div>
        <Heading as="h3">{currentQuestion?.question}</Heading>
        <div className="space-y-3">
          {currentQuestion?.options.map((option) => (
            <button
              key={option}
              onClick={() => setSelectedAnswer(option)}
              className={cn(
                'w-full text-left p-4 rounded-xl border transition-all',
                selectedAnswer === option
                  ? 'bg-brand-purple/10 border-brand-purple/40 text-brand-purple'
                  : 'bg-gray-50 border-border-light hover:bg-gray-100'
              )}
            >
              {option}
            </button>
          ))}
        </div>
        {error && <Text className="text-red-500">{error}</Text>}
        <div className="flex justify-end">
          <Text className="text-sm text-text-secondary">
            {isLoading || isAutoAdvancing ? 'Moving to next question...' : 'Select an option to continue'}
          </Text>
        </div>
      </Card>
    </div>
  );
};
