<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Resources\MessageResource;
use App\Models\MessageAttachment;
use App\Models\Conversation;
use App\Events\SocketMessage;
use App\Models\User;
use App\Models\Group;
use App\Models\Message;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use App\Http\Requests\StoreMessageRequest;


class MessageController extends Controller
{
    /**
     * Get all messages by user (Receiver/Sender) Ids
     */
    public function byUser(User $user)
    {
        $messages = Message::where('sender_id', auth()->id())
                    ->where('receiver_id', $user->id)
                    ->orWhere('sender_id', $user->id)
                    ->where('receiver_id', auth()->id())
                    ->latest()
                    ->paginate(10);

        return Inertia::render('Dashboard', [
            'selectedConversation' => $user->toConversationArray(),
            'messages' => MessageResource::collection($messages)
        ]);
    }

    /**
     * Get Message by Group
     */
    public function byGroup(Group $group)
    {
        $messages = Message::where('group_id', $group->id)
                    ->latest()
                    ->paginate(10);

        return Inertia::render('Dashboard', [
            'selectedConversation' => $group->toConversationArray(),
            'messages' => MessageResource::collection($messages)
        ]);
    }

    /**
     * Get Messages By date
     */
    public function byOlder(Message $message)
    {
        // Load older messages that are older than the given message, sort them by the latest
        if ($message->group_id) {
            $messages = Message::where('created_at', '<', $message->created_at)
                        ->where('group_id', $message->group_id)
                        ->latest()
                        ->paginate(10);
        } else {
            $messages = Message::where('created_at', '<', $message->created_at)
                        ->where(function ($query) use ($message) {
                            $query->where('sender_id', $message->sender_id)
                                ->where('receiver_id', $message->receiver_id)
                                ->orWhere('sender_id', $message->receiver_id)
                                ->where('receiver_id', $message->receiver_id);
                        })
                        ->latest()
                        ->paginate(10);
        }

        return MessageResource::collection($messages);
    }

    /**
     * Store newly created resource in storage
     */
    public function store(StoreMessageRequest $request)
    {
        $data = $request->validated();
        $data['sender_id'] = auth()->id();
        $receiverId = $data['receiver_id'] ?? NULL;
        $groupId = $data['group_id'] ?? NULL;

        $files = $data['attachments'] ?? [];

        $message = Message::create($data);

        $attachments = [];

        if ($files) {
            foreach ($files as $file) {
                $directory = 'attachment/'. Str::random(32);
                Storage::makeDirectory($directory);

                $model = [
                    'message_id' => $message->id,
                    'name' => $file->getClientOriginalName(),
                    'mime_type' => $file->getClientMimeType(),
                    'size' => $file->getSize(),
                    'path' => $file->store($directory, 'public'),
                ];
                $attachment = MessageAttachment::create($model);
                $attachments[] = $attachment;
            }

            $message->attachments = $attachments;
        }

        if ($receiverId) {
            Conversation::updateConversationWithMessage($receiverId, auth()->id(), $message);
        }

        if ($groupId) {
            Group::updateGroupWithMessage($groupId, $message);
        }

        SocketMessage::dispatch($message);

        return new MessageResource($message);
    }

    /**
     * Remove the specified resource from storage
     */
    public function destroy(Message $message)
    {
        // Check if user is the owner of the message
        if ($message->sender_id !== auth()->id()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $message->delete();

        return response('', 204);
    }
}
