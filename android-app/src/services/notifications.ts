import notifee, {
  TriggerType,
  RepeatFrequency,
  AndroidImportance,
  AndroidCategory,
  TimestampTrigger,
} from '@notifee/react-native';
import { updateStreak } from './firestore';

const CHANNEL_IDS = {
  DAILY_REMINDER: 'daily_reminder',
  STREAK_ALERT: 'streak_alert',
  ACHIEVEMENT: 'achievement',
} as const;

export async function createNotificationChannels(): Promise<void> {
  await notifee.createChannel({
    id: CHANNEL_IDS.DAILY_REMINDER,
    name: 'Daily Training Reminder',
    description: 'Your daily nudge to train at your preferred time',
    importance: AndroidImportance.HIGH,
  });

  await notifee.createChannel({
    id: CHANNEL_IDS.STREAK_ALERT,
    name: 'Streak Alerts',
    description: 'Warnings when your training streak is about to expire',
    importance: AndroidImportance.HIGH,
    category: AndroidCategory.REMINDER,
  });

  await notifee.createChannel({
    id: CHANNEL_IDS.ACHIEVEMENT,
    name: 'Achievements',
    description: 'Notifications when you earn badges or reach milestones',
    importance: AndroidImportance.DEFAULT,
  });
}

export async function scheduleDailyReminder(
  hour: number,
  minute: number,
): Promise<void> {
  await notifee.cancelTriggerNotifications();

  const now = new Date();
  const trigger = new Date();
  trigger.setHours(hour, minute, 0, 0);

  if (trigger.getTime() <= now.getTime()) {
    trigger.setDate(trigger.getDate() + 1);
  }

  const messages = [
    "Your communication gym is open. Time to train.",
    "Consistency builds mastery. Let's get a session in.",
    "The ring is waiting. Step in for today's practice.",
    "Small daily reps compound. Ready to sharpen up?",
    "Champions train even on off days. Hit your drills.",
  ];

  const body = messages[Math.floor(Math.random() * messages.length)];

  const timestampTrigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: trigger.getTime(),
    repeatFrequency: RepeatFrequency.DAILY,
  };

  await notifee.createTriggerNotification(
    {
      title: 'Daily Training',
      body,
      android: {
        channelId: CHANNEL_IDS.DAILY_REMINDER,
        smallIcon: 'ic_notification',
        pressAction: { id: 'default' },
      },
    },
    timestampTrigger,
  );
}

export async function scheduleStreakReminder(): Promise<void> {
  const now = new Date();
  const trigger = new Date();
  trigger.setHours(20, 0, 0, 0);

  if (trigger.getTime() <= now.getTime()) {
    trigger.setDate(trigger.getDate() + 1);
  }

  const timestampTrigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: trigger.getTime(),
    repeatFrequency: RepeatFrequency.DAILY,
  };

  await notifee.createTriggerNotification(
    {
      id: 'streak_reminder',
      title: 'Streak at Risk',
      body: "You haven't trained today. Complete a quick drill to keep your streak alive.",
      android: {
        channelId: CHANNEL_IDS.STREAK_ALERT,
        smallIcon: 'ic_notification',
        pressAction: { id: 'default' },
      },
    },
    timestampTrigger,
  );
}

export async function showBadgeNotification(
  badgeName: string,
  badgeTier: string,
): Promise<void> {
  await notifee.displayNotification({
    title: 'Badge Earned!',
    body: `You unlocked "${badgeName}" (${badgeTier}). Keep pushing your limits.`,
    android: {
      channelId: CHANNEL_IDS.ACHIEVEMENT,
      smallIcon: 'ic_notification',
      pressAction: { id: 'default' },
    },
  });
}

export async function showStreakMilestone(streak: number): Promise<void> {
  const milestones = [3, 7, 14, 30, 60, 100];
  if (!milestones.includes(streak)) return;

  await notifee.displayNotification({
    title: `${streak}-Day Streak!`,
    body: `You've trained ${streak} days in a row. That's real discipline.`,
    android: {
      channelId: CHANNEL_IDS.ACHIEVEMENT,
      smallIcon: 'ic_notification',
      pressAction: { id: 'default' },
    },
  });
}

export async function cancelAllScheduledNotifications(): Promise<void> {
  await notifee.cancelTriggerNotifications();
}

export function parseReminderTime(timeStr: string): { hour: number; minute: number } {
  const [h, m] = timeStr.split(':').map(Number);
  return { hour: h || 9, minute: m || 0 };
}
