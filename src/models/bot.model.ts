import { employees } from "../db/Schemas/employees";

export const createBirthdayPeople = async (
  arrNames: string[],
  arrBirthdates: (Date | undefined)[],
  userId: string | undefined
) => {
  const users: InstanceType<typeof employees>[] = [];

  await employees.create(
    ...arrNames.map((el, i) => {
      return {
        fullName: el,
        birthdayDate: arrBirthdates[i],
        listGifts: [
          {
            title: "Чашка",
          },
          {
            title: "Портфель",
          },
          {
            title: "Коцик",
          },
          {
            title: "Премія",
          },
        ],
        user: userId,
      };
    })
  );

  for await (let name of arrNames) {
    const items = (
      await employees.find({
        fullName: name,
        user: userId,
      })
    ).filter((u) => !users.find((u2) => u2._id === u._id));

    items.forEach((item) => users.push(item));
  }

  return users;
};
