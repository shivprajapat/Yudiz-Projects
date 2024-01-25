import mock from '../mock'
const data = {
  profileData: {
    header: {
      username: 'Kitty Allanson',
      designation: 'UI/UX Designer'
    },
    userAbout: {
      about: 'Tart I love sugar plum I love oat cake. Sweet ⭐️ roll caramels I love jujubes. Topping cake wafer.',
      joined: 'November 15, 2015',
      lives: 'New York, USA',
      email: 'bucketful@fiendhead.org',
      website: 'www.pixinvent.com'
    }
  }
}
mock.onGet('/profile/data').reply(() => [200, data.profileData])
