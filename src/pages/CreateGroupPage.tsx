type CreateGroupPageProps = {
  userName: string;
};

function CreateGroupPage({ userName }: CreateGroupPageProps) {
  return (
    <div>
      <h1>Create a group</h1>
      <p>Current user {userName} will be added automatically</p>
    </div>
  );
}

export default CreateGroupPage;
